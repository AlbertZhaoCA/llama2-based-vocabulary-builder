import requests
import json
from pymongo import MongoClient

file = open('error_word', 'w')
client = MongoClient('localhost', 27017)
db = client['corpus']
collection = db['words']
with open('words.txt', 'r') as f:
    word_list = f.readlines()

# Remove any newline characters
word_list = [word.strip() for word in word_list]

count = 0
length = len(word_list)
for word in word_list:
    count += 1
    try:
        response = requests.post('http://localhost:11434/api/generate', json={
            "model": "example",
            "prompt": f" 用中文解释{word}这个单词,你必须要提供释义，音标 和使用场景，只有使用场景举例请使用英文，请给我json格式.",
            "format": "json",
            "stream": False
        })
        x = json.loads(response.text)
        sent_json = x['response']
        sent_json_obj = json.loads(sent_json)
        collection.insert_one(sent_json_obj)
    except Exception as e:
        print(f"An error occurred with word {word}: {e}")
        file.write(f"An error occurred with word {word}: {e}\n")
    print(length - count)