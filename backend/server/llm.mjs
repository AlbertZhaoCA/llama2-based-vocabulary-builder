import { config } from 'dotenv';
import {Groq} from 'groq-sdk';

config({ path: '../../config/.env' })

console.log(process.env.API_KEY); 

const groq = new Groq({
    apiKey: process.env.API_KEY
});
async function main() {
    const chatCompletion = await getGroqChatCompletion();
    // Print the completion returned by the LLM.
    process.stdout.write(chatCompletion.choices[0]?.message?.content || "");
}
async function getGroqChatCompletion() {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "punycode 是什么意思，以json格式返回给我意思，音标，衍生词"
            }
        ],
        model: "llama2-70b-4096"
    });
}
main();