import express from 'express';
import cors from 'cors';
import { agent } from './groq.mjs';
import https from 'https';
import fs from 'fs';
import  ollama  from 'ollama';

const app = express();
app.use(cors());
app.use(express.json());

const privateKey = fs.readFileSync('/Users/albert/Desktop/web/web/private-key.pem', 'utf8');
const certificate = fs.readFileSync('/Users/albert/Desktop/web/web/certificate.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);


app.post('/chat',(req, res) => {
  try{
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const userContent = req.body;
  console.log(userContent);
  console.log("\n\n\n\n");
  handleResponse(userContent,req,res);}catch(error){
    console.error('Ejkhlkjhjkljk hk hjkhlkj hj:');
  }
});

const handleResponse = async (json,req,res) => {
  json?.sentence && json?.word
  ? `${json.word}在 ${json.sentence} 中什么意思，如何理解，还有其他用法吗，你能给出这个句子中其他比较重要的单词和意思吗。请使用中文`
  : json?.word
  ? `${json.word}是什么意思，他如何发音，意思是什么，是否常见，给出对应词族和一些应用场景。请使用中文`
  : json?.sentence ? `${json.sentence}是什么意思,提取出里面比较难的单词`: (() => {
        throw new Error('Invalid input');
    })();
  const response = await ollama.chat({ model: 'llama2', messages: json, stream: true });

  for await (const part of response) {
    res.write(`data: ${part.message.content}\n\n`);
  }

  // End the response if the client closes the connection
  req.on('close', () => {
    res.end();
  });
};





app.listen(10001, () => {
    console.log('HTTPS Server is running on port 10001');
});
  