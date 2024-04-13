import os

from groq import Groq

client = Groq(
    api_key=("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"),
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Explain the importance of fast language models",
        }
    ],
    model="mixtral-8x7b-32768",
)

print(chat_completion.choices[0].message.content)