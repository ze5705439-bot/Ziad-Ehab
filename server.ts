import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

function pcmToWav(pcmData: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmData.length;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  pcmData.copy(buffer, 44);

  return buffer;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  const hasApiKey = Boolean(process.env.GEMINI_API_KEY);
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health and status endpoint
  app.get('/api/status', (_req, res) => {
    res.json({
      status: 'ok',
      hasApiKey,
      models: [
        {
          id: 'gemini-3.8-flash-lite-tts',
          name: 'Gemini 3.8 Flash Lite TTS',
          description: 'High-speed, expressive neural voice model for single-speaker audio & screen reading.',
          recommendedFor: 'Articles, narration, assistant responses, voiceovers'
        },
        {
          id: 'gemini-3.8-flash-tts',
          name: 'Gemini 3.8 Flash TTS Flagship',
          description: 'Flagship audio model with Voice Design, multi-speaker screenplays, backchanneling, and vocal bursts.',
          recommendedFor: 'Podcasts, screenplays, dual-speaker drama, vocal burst effects'
        }
      ],
      prebuiltVoices: [
        { name: 'Kore', gender: 'Female', tone: 'Warm, natural, clear' },
        { name: 'Puck', gender: 'Male', tone: 'Youthful, energetic, friendly' },
        { name: 'Charon', gender: 'Male', tone: 'Deep, resonant, authoritative' },
        { name: 'Fenrir', gender: 'Male', tone: 'Bold, cinematic, intense' },
        { name: 'Zephyr', gender: 'Androgynous/Female', tone: 'Crisp, contemporary, tech' },
        { name: 'Aoede', gender: 'Female', tone: 'Melodic, engaging, narrative' },
        { name: 'Leto', gender: 'Female', tone: 'Gentle, soothing, documentary' }
      ]
    });
  });

  // TTS Generation Endpoint
  app.post('/api/tts/generate', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY is not configured on the server. You can still use the Browser Web Speech engine immediately, or configure the secret in Settings.',
          fallbackAvailable: true,
        });
      }

      const {
        mode = 'single',
        text,
        voice = 'Kore',
        style,
        model = 'gemini-3.8-flash-lite-tts',
        turns = [],
        speakers = [
          { name: 'Alex', voice: 'Puck' },
          { name: 'Sam', voice: 'Kore' },
        ],
      } = req.body;

      if (mode === 'single') {
        if (!text || typeof text !== 'string' || !text.trim()) {
          return res.status(400).json({ error: 'Please provide valid text to synthesize.' });
        }

        const selectedModel = model || 'gemini-3.8-flash-lite-tts';
        const parts: any[] = [
          {
            text: text.trim(),
            ...(style && style.trim() ? { speechMetadata: { style: style.trim() } } : {}),
          },
        ];

        const response = await ai.models.generateContent({
          model: selectedModel,
          contents: [
            {
              role: 'user',
              parts,
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
              },
            },
          },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        const rawAudioBase64 = part?.inlineData?.data;
        const mimeType = part?.inlineData?.mimeType || 'audio/pcm;rate=24000';

        if (!rawAudioBase64) {
          return res.status(502).json({
            error: 'No audio data was returned by the voice model. Please try different text or voice.',
          });
        }

        // If returned as raw PCM, wrap into high quality WAV
        let wavBase64 = rawAudioBase64;
        let isWav = mimeType.includes('wav');
        let pcmBuffer = Buffer.from(rawAudioBase64, 'base64');
        let durationSeconds = 0;

        if (!isWav) {
          const wavBuffer = pcmToWav(pcmBuffer, 24000, 1, 16);
          wavBase64 = wavBuffer.toString('base64');
          durationSeconds = Math.round((pcmBuffer.length / 48000) * 100) / 100;
        } else {
          durationSeconds = Math.round((pcmBuffer.length / 48000) * 100) / 100;
        }

        return res.json({
          success: true,
          audioWavBase64: wavBase64,
          mimeType: 'audio/wav',
          sampleRate: 24000,
          durationSeconds,
          model: selectedModel,
          voice,
          mode: 'single',
        });
      } else if (mode === 'multi') {
        // Multi-speaker Screenplay / Dialogue mode
        if (!Array.isArray(turns) || turns.length === 0) {
          return res.status(400).json({ error: 'Please provide dialogue turns for multi-speaker synthesis.' });
        }

        // Gemini multiSpeakerVoiceConfig requires exactly 2 speakerVoiceConfigs
        const speakerA = speakers[0] || { name: 'Alex', voice: 'Puck' };
        const speakerB = speakers[1] || { name: 'Sam', voice: 'Kore' };

        const dialogueParts = turns.map((turn: { speaker: string; text: string; style?: string }) => {
          const speakerName = turn.speaker || speakerA.name;
          const turnText = turn.text.trim();
          return {
            text: `${speakerName}: ${turnText}`,
            speechMetadata: {
              speaker: speakerName,
              ...(turn.style && turn.style.trim() ? { style: turn.style.trim() } : {}),
            },
          };
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts: dialogueParts,
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  {
                    speaker: speakerA.name,
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: speakerA.voice || 'Puck' },
                    },
                  },
                  {
                    speaker: speakerB.name,
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: speakerB.voice || 'Kore' },
                    },
                  },
                ],
              },
            },
          },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        const rawAudioBase64 = part?.inlineData?.data;
        const mimeType = part?.inlineData?.mimeType || 'audio/pcm;rate=24000';

        if (!rawAudioBase64) {
          return res.status(502).json({
            error: 'No multi-speaker audio was generated. Please ensure dialogue has valid lines for both speakers.',
          });
        }

        const pcmBuffer = Buffer.from(rawAudioBase64, 'base64');
        const wavBuffer = pcmToWav(pcmBuffer, 24000, 1, 16);
        const wavBase64 = wavBuffer.toString('base64');
        const durationSeconds = Math.round((pcmBuffer.length / 48000) * 100) / 100;

        return res.json({
          success: true,
          audioWavBase64: wavBase64,
          mimeType: 'audio/wav',
          sampleRate: 24000,
          durationSeconds,
          model: 'gemini-3.8-flash-tts',
          mode: 'multi',
          speakers: [speakerA, speakerB],
        });
      } else {
        return res.status(400).json({ error: `Unsupported mode: ${mode}` });
      }
    } catch (err: any) {
      console.error('Error generating speech:', err);
      const message = err?.message || 'Failed to synthesize speech';
      return res.status(500).json({
        error: message,
        fallbackAvailable: true,
      });
    }
  });

  // Mount Vite or static dist
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VoxStudio TTS Console running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
