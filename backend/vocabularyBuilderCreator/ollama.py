import requests
import json
from word_corpus import word_list
from pymongo import MongoClient

file = open('error_word', 'w')
client = MongoClient('localhost', 27017)
db = client['corpus']
collection = db['words']

collection = db['words']

count = 0
length = len(word_list)
for word in word_list:
    count += 1
    try:
        response = requests.post('http://localhost:11434/api/generate', json={
            "model": "example",
            "prompt": f"I am studying the word {word}. Please explain this word to me, provide its pronunciation, meaning, usage, frequency, word family, and common collocations in JSON format.",
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