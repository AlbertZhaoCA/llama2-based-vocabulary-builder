import { config } from 'dotenv';
import {Groq} from 'groq-sdk';
import logger from './logger.mjs';

config({ path: '../../config/.env' })
console.log(process.env.API_KEY); 

const groq = new Groq({
    apiKey: process.env.API_KEY,
});

  

export async function agent(json,req,res) {
    try{
    const stream = await getGroqChatStream(json);
    
    for await (const chunk of stream){
       // Print the completion returned by the LLM.
        res.write(`data: ${chunk.choices[0]?.delta?.content||""}\n\n`);
        }

    req.on('close', () => {
        logger.info(`response endded at ${new Date()}`);
        res.end();
    });}catch(error){
        logger.logError(error,'groq agent');
        res.end('有个小错误发生了，请重新请求');
    }
}

async function getGroqChatStream(json){
    return groq.chat.completions.create({
      
        messages: [
            {
                role: "system",
                content: `"你是一名英语导师，帮助中国用户理解他们提供的句子或词汇。你只能用中文解释，
                只有在必要时才能使用英语，不要使用其他语言。"`
                /* I do not why, but the English prompt got most English response :<
                You are an English tutor to assist Chinese users in comprehending
                the sentences or vocabulary they provide. You can only explain in Chinese 
                and use English only when necessary, do not use other languages.*/
            },
            {
                role: "user",
                content: json?.sentence && json?.word
                    ? `${json.word}在 ${json.sentence} 中什么意思，如何理解，还有其他用法吗，你能给出这个句子中其他比较重要的单词和意思吗。请使用中文`
                    : json?.word
                    ? `${json.word}是什么意思，他如何发音,给出音标，告诉用户是否常见，给出对应词族和一些应用场景。请使用中文`
                    : json?.sentence ? `${json.sentence}是什么意思,提取出里面比较难的单词和一些应用场景，请使用中文`: (() => {
                          throw new Error('Invalid input');
                      })()
            }
        ],      
        model: "llama2-70b-4096",
        temperature: 0.5,
        max_tokens: 2000, 
        top_p: 1,
        stop: null,
        stream: true,
    });
};

