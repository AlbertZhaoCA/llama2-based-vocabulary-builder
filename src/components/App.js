import React, { useState } from 'react';
import '../App.css';
import { InputWithButton,Input } from './Input';
import { Context } from './context';
import ollama from 'ollama/browser'
import { Button } from './Button';



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
      '解释': 'greeting or salutation',
      }

  const [vocabList,setVocabList] = useState([initial]);
  const [inputValue,setInputValue] = useState('');
  const [filled,setFilled] = useState(true);
  const [searchValue,setSearchValue] = useState('');
  const [searchMeaning,setSearchMeaning] = useState('');
  const [isCollapsed,setIsCollapsed] = useState(false);
  const [isClicked,setIsClicked] = useState(false);



   function handler0(){

    searchVocab(inputValue).then(async(data) => {
      console.log(data);

      const response = await ollama.chat({
        model: 'llama2',
        messages: [{ role: 'user', content: `the meaning of ${inputValue}`}],
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

  function handler2(){
    vocabList.map((key, index) => {
      if (key.word === searchValue) {
        console.log(key['解释']);
        setSearchMeaning(key['解释'])    
        }
        setSearchValue('');
    })
  }


  return (
  <Context.Provider value={{handler0, handler1,handler2,filled}}>
    <div className='container'>
    {!isCollapsed && <div className='word-list'> {
      
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
        

        <div className='inputing'>
          <p> {inputValue}</p>
        </div>
    </div>
    }
     {isCollapsed && <div className='word-list no-column-flex'> {
      
      vocabList.map((key, index) => {
        
            return (
            <ul className='collapsed' style={{
         
        }}>
              <li key={index}>{key['单词']}</li>
              </ul>  );
          
          })
          }
          
        

        <div className='inputing'>
          <p> {inputValue} </p>
        </div>
    </div>
    }
    <InputWithButton  value={inputValue}  type="text"  onChange={
      (e) =>{
       setInputValue(e.target.value);
       setFilled(e.target.value.length == 0);
    }
    } handlers={handler0} />
    <div style={{display:'flex'}}>
    <Button 
  styles={{"fontSize":'0.5rem', "borderRadius":0}} 
  event={isClicked ? '展开' : '收起'} 
  handler={() => {
    setIsCollapsed(!isCollapsed);
    setIsClicked(!isClicked);
  }} 
/>
    <Input placeholder='查找生词本的单词' value={searchValue}  type="text"onChange={
      (e) =>{
       setSearchValue(e.target.value);
    }
    } handlers={handler2} />
    <Button styles={{"fontSize":'0.5rem',"borderRadius":0}} event='查找' handler={handler2} />
    <Button styles={{"fontSize":'0.5rem',"borderRadius":0}} event='清除' handler={()=>{setSearchMeaning('')}} />
    </div>
    
    <p>{searchMeaning}</p>
    <div className='footer'>© 2024 Albert. All rights reserved.</div>
    
  
   </div> 
  </Context.Provider>
  );
}

export default App;
