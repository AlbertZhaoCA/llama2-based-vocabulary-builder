import express from 'express';
import cors from 'cors';
import { agent } from './groq.mjs';
import https from 'https';
import fs from 'fs';
import logger from './logger.mjs';

const app = express();
app.use(cors());
app.use(express.json());

/*
 not used because i am using nternal network penetration, maybe one day 
 change to the server
*/

const privateKey = fs.readFileSync('../../private-key.pem', 'utf8');
const certificate = fs.readFileSync('../../certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);//hope I can afford a server

let handledRequests = 0;
let recivedRequests = 0;
const startTime = new Date();


app.post('/chat',(req, res) => {
  try{
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  recivedRequests++;
  
  res.setTimeout(25000, () => {  
      res.end('Oops, 抱歉让你等待这么久，但我们的服务似乎出现了问题');
    });
  const userContent = req.body;

  logger.info(`test user make a request: ${JSON.stringify(userContent)} at ${new Date()}`);
  agent(userContent, req, res);
}
  catch(error){
    logger.logError(error,'/Chat endpoint serverside');
  }
});

app.listen(10001, () => {
  console.log('HTTPS Server is running on port 10001');
  logger.info(`Server started at ${startTime}`);
});

//Ctrl+C
process.on('SIGINT', function() {
  const now = new Date();
  const runTime = Date.now() - startTime;
  console.log("\nGracefully shutting down from SIGTERM");
  logger.info(`Gracefully shutting down from SIGINT at ${now} after ${runTime}ms`);
  console.log("\nAlready shut down Gracefully (Ctrl+C)");
  process.exit();
});


process.on('SIGTERM', function() {
  const now = new Date();
  const runTime = Date.now() - startTime;
  console.log("\nGracefully shutting down from SIGTERM");
  logger.info(`Gracefully shutting down from SIGINT at ${now} after ${runTime}ms`);
  console.log("\nAlready shut down Gracefully (Ctrl+C)");
  process.exit();
});

process.on('uncaughtException', function(err) {
  const now = new Date();
  console.log(`Caught exception: ${err}`);
  logger.logError(err,'uncaughtException');
  process.exit(1);
});


