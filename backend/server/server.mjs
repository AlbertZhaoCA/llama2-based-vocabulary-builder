import express from 'express';
import cors from 'cors';
import { agent } from './groq.mjs';
import https from 'https';
import fs from 'fs';

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
  agent(userContent, req, res);}catch(error){
    console.error(`${error}`);
  }
});

app.listen(10001, () => {
  console.log('HTTPS Server is running on port 10001');
});




