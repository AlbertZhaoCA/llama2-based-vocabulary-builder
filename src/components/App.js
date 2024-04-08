import React, { useState } from 'react';
import '../App.css';
import { InputWithButton } from './Input';
import { Context } from './context';
import ollama from 'ollama/browser'


async function searchVocab(word) {
  try {
   
    let resp = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!resp.ok) {
      if (resp.status === 404) {
        throw new Error('Word not found in the dictionary');
      }
      let error = await resp.text();
      throw new Error(error);
    }
    let data = await resp.json();

    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

  function App() {

    let initial ={
      '单词': 'Hello /həˈloʊ/',
      '意思': 'greeting or salutation',
      '词族': ['greeting','salutation']
      }

  const [vocabList,setVocabList] = useState([initial]);
  const [inputid,setinputId] = useState(0);
  const [inputValue,setInputValue] = useState('');
  const [filled,setFilled] = useState(true);


   function handler0(){

    searchVocab(inputValue).then(async(data) => {
      console.log(data)
      let word = data?.[0]?.word ?? '没找到这个词✌️';
      let meaning = data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ?? '没找到这个词✌️';
      let synonyms = data?.[0]?.meanings?.[0]?.definitions?.[0]?.synonyms ?? '没找到这个词✌️';
      const response = await ollama.chat({
        model: 'llama2',
        messages: [{ role: 'user', content: `meaning of ${inputValue}`}],
      })
      
      let newVocab = {
        '单词': `${inputValue}  ${data?.[0]?.phonetics?.[0]?.text ?? '/no phonetics was found/'}`, 
        '解释': response.message.content,
        '词族': synonyms
      }
      setVocabList([...vocabList,newVocab])
     
    })
    setInputValue('');
  }

  function handler1(){
    console.log('Button clicked');
  }

  

  return (
  <Context.Provider value={{handler0, handler1,filled}}>
    <div> {
      vocabList.map((key, index) => {
        return <ul key={index}>
          {Object.entries(key).map(([key, value], index) => <li key={index}>{`${key}: ${value}`}</li>)}
        </ul>
      })
    } 
    </div>

    <div>
      <p> {inputValue}</p>
    </div>
    <InputWithButton id={inputid} value={inputValue}  type="text"  onChange={
      (e) =>{
       setInputValue(e.target.value);
       setFilled(e.target.value.length == 0);
    }
    }  />
  
  </Context.Provider>
    
  );
}

export default App;
