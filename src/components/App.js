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
      'word': 'hello',
      '单词': 'hello /həˈloʊ/',
      '意思': 'greeting or salutation',
      '词族': ['greeting','salutation']
      }

  const [vocabList,setVocabList] = useState([initial]);
  const [inputid,setinputId] = useState(0);
  const [inputValue,setInputValue] = useState('');
  const [filled,setFilled] = useState(true);


   function handler0(){

    searchVocab(inputValue).then(async(data) => {
      console.log(data);

      const response = await ollama.chat({
        model: 'llama2',
        messages: [{ role: 'assistant', content: `help me to learn this word ${inputValue}`}],
      })

      
      let newVocab = {
        'word':inputValue,
        '单词': `${inputValue}  ${data?.[0]?.phonetics?.[0]?.text ?? '/no phonetics was found/'}`, 
        '解释': response.message.content,
      }
      setVocabList([...vocabList,newVocab])
     
    })
    setInputValue('');
  }

  function handler1(){
    if (inputValue) {
      console.log(vocabList.filter(para => para.word !== inputValue))
      setVocabList(vocabList.filter(para => para.word !== inputValue));
    } else {
      setVocabList(vocabList.slice(0, -1));
    }
    setInputValue('');
  }

  

  return (
  <Context.Provider value={{handler0, handler1,filled}}>
    <div className='container'>
    <div className='word-list'> {
      vocabList.map((key, index) => {
            return (
              <ul key={index}>
                {Object.entries(key).map(([key, value], index) => {
                  if (key !== 'word') {
                    return <li key={index}>{`${key}: ${value}`}</li>;
                  }
                })}
              </ul>
            );
          })}
        

        <div>
          <p> {inputValue}</p>
        </div>
    </div>
    <InputWithButton id={inputid} value={inputValue}  type="text"  onChange={
      (e) =>{
       setInputValue(e.target.value);
       setFilled(e.target.value.length == 0);
    }
    }  />
    <div className='footer'>© 2024 Albert. All rights reserved.</div>
    
  
   </div> 
  </Context.Provider>
  );
}

export default App;
