import requests
import json
response = requests.post('http://localhost:11434/api/generate', json={
    "model": "vocabCreator:latest",
    "prompt": "我在学习daytime这个单词,请解释这个单词,给我发音,意思,用法,使用频率,词族和常见搭配,用json格式返回",
    "format": "json",
    "stream": False
})

# Use json.dumps with indent parameter to pretty-print the JSON
print(response.json())