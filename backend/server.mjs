import express from 'express';
import cors from 'cors';
import ollama from 'ollama';

const app = express();
app.use(cors());

app.get('/chat', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const userContent = req.query.content;
  const message = { role: 'user', content: userContent };

  const handleResponse = async () => {
    const response = await ollama.chat({ model: 'llama2', messages: [message], stream: true });

    for await (const part of response) {
      res.write(`data: ${part.message.content}\n\n`);
    }

    // End the response if the client closes the connection
    req.on('close', () => {
      res.end();
    });
  };

  handleResponse();
});

app.listen(10001, () => {
  console.log('Server is running on port 10001');
});