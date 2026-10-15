import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { handleChat, handleHealth, handleMessages } from './handlers.js';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '256kb' }));

app.get('/health', handleHealth);
app.get('/messages', handleMessages);
app.post('/chat', handleChat);

app.listen(port, () => {
  console.log(`Chat API listening on http://localhost:${port}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('Warning: GEMINI_API_KEY is not set — POST /chat отвечает демо-текстом про уход.');
  }
});
