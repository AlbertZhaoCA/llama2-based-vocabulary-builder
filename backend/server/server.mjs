import express from 'express';
import cors from 'cors';
import { agent } from './groq.mjs';
const app = express();
app.use(cors());
app.use(express.json());


app.post('/chat', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const userContent = req.body;
  console.log(userContent);
  console.log("\n\n\n\n");
  agent(userContent, req,res);
});

app.listen(10001, () => {
  console.log('Server is running on port 10001');
}); 