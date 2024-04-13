import React, { useState } from 'react';
import '../App.css';
import { InputWithButton,Input } from './Input';
import { Context } from './context';
import { Button } from './Button';
import  Dived  from './divideWords';

async function searchVocab(word) {
  try {
    console.log(word);
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
      'word': 'example',
      '单词': ' example /ɪg\'zæmpl/',
      '解释': '这是一个小小的🌰,希望你查到最合适的解释',
      '背景': 'For example, if you give us the context, we will show you here',
      }

  const [vocabList,setVocabList] = useState([initial]);
  const [inputValue,setInputValue] = useState('');
  const [filled,setFilled] = useState(true);
  const [searchValue,setSearchValue] = useState('');
  const [searchMeaning,setSearchMeaning] = useState('');
  const [isCollapsed,setIsCollapsed] = useState(false);
  const [isClicked,setIsClicked] = useState(false);
  const [submited,setSubmited] = useState({});



  async function addHandler(e,{word,sentence=inputValue}) {
    try {
      e.preventDefault();
  
      let newVocab = {
        'word':word,
        '单词': '', 
        '解释': '',
        '背景': sentence ? sentence : '',
      };
  
      if (word) {
        newVocab['单词'] = word;
      } else {
        newVocab['单词'] = sentence.slice(4);
      }

      const data = { word: word, sentence: sentence };
      const response = await fetch('http://localhost:10001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then(response => {
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }    
                
                const text = new TextDecoder("utf-8").decode(value);
                const cleanedText = text.replace(/(data: .*?)\s*(?=data:|$)/g, '$1').replace(/data: /g, '');    

                newVocab['解释'] += cleanedText;
                setVocabList([...vocabList,newVocab])
                
                push();
              });
            }
            push();
          }
        });
      })
      .then(stream => {
        return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
      })
      .then(result => {
        console.log(result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      setInputValue('');
   
    }catch(error){
      console.error('Error:', error);
    }
  }
  
  function deleteHandler(e){
    try {
      e.preventDefault();

    if (inputValue) {
      console.log(vocabList.filter(para => para.word !== inputValue))
      setVocabList(vocabList.filter(para => para.word !== inputValue));
    } else {
      setVocabList(vocabList.slice(0, -1));
    }
    setInputValue('');
  }
    catch (error) {
      console.error('Error:', error);
    }
  }

  function searchHandler(e){
    try{
      e.preventDefault();

    vocabList.map((key) => {
      if (key.word === searchValue) {
        console.log(key['解释']);
        setSearchMeaning(key['解释'])    
        }
        setSearchValue('');
    })
  }
  catch (error) {
    console.error('Error:', error);
  }
  }

  function handleWordClick(word) {
    setSubmited({word: word,sentence: inputValue});
    console.log('clicked');
}


  return (
  <Context.Provider value={{addHandler, deleteHandler,searchHandler,
  filled,inputValue,submited,setSubmited}}>
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
          })
          }  

        <div className='inputing'>
          <Dived str={inputValue} onWordClick={handleWordClick} />
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
        <Dived str={inputValue} onWordClick={handleWordClick} />
        </div>
    </div>
    }
    <form onSubmit={e=>{addHandler(e,submited)}}>
    <InputWithButton  value={inputValue}  type="text"  onChange={
      (e) =>{
       setInputValue(e.target.value);
       setFilled(e.target.value.length == 0);
    }
    } />
    </form>
   
    <div className='search-bar'>

    <form onSubmit={(e)=>searchHandler(e)}>
      <Input placeholder='查找生词本的单词' value={searchValue}  type="text" onChange={
      (e) =>{
       setSearchValue(e.target.value);
    }
    }  />
    <Button styles={{"fontSize":'0.5rem',"borderRadius":0}} event='查找'  />
    </form>

    <form onSubmit={e=>deleteHandler(e)}>
    <Button styles={{"fontSize":'0.5rem',"borderRadius":0}} event='清除' />
    </form>
    </div>
   
  <Button 
  styles={{"fontSize":'0.5rem', "borderRadius":0, "margin": '10px'}} 
  event={isClicked ? '展开' : '收起'} 
  handler={() => {
    setIsCollapsed(!isCollapsed);
    setIsClicked(!isClicked);
  }} 
/> 
<p>{searchMeaning}</p>
 <div className='footer'>© 2024 Kitty Bob. All rights reserved.</div>
    
   </div> 
  </Context.Provider>
  );
}

export default App;
  