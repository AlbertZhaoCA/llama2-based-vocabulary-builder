import React, { useState } from 'react';
import '../App.css';
import { InputWithButton,Input } from './Input';
import { Context } from './context';
import { Button } from './Button';
import  Dived  from './divideWords';
import { useEffect } from 'react';
import Card from './Card';
import Load from './Load';

  function App() {
    

    let initial ={
      'word': 'welcome',
      '单词': ' Welcom 欢迎 Salut いらっしゃいませ',
      '解释': '这句话使用了四种语言表达欢迎, 意思是欢迎或者欢迎光临。它用来表示对某人或某事的热烈欢迎或接纳。在酒店、商店、活动等场合，用来表示欢迎客人或参与者。',
      '背景': 'For, example👉welcom 欢迎 Salut いらっしゃいませ(在回显区点击你要查的单词,我们会给你单词在语境里的意思), if you give us the context, we will show you here',
      }

  const [vocabList,setVocabList] = useState(JSON.parse(localStorage.getItem('vocabList')) || [initial]);
  const [inputValue,setInputValue] = useState('');
  const [filled0,setFilled0] = useState(true);
  const [filled1,setFilled1] = useState(true);
  const [searchValue,setSearchValue] = useState('');//for searching added words in word list
  const [searchMeaning,setSearchMeaning] = useState('');//for showing the meaning of the searched word
  const [isCollapsed,setIsCollapsed] = useState(JSON.parse(localStorage.getItem('isCollapsed')) || false);//fold the word list
  const [isClicked,setIsClicked] = useState(false);
  const [submited,setSubmited] = useState({});//the word that will be added to the word list
  const [normalResponse,setNormalResponse] = useState(false);//the response from the server
  const [searchedWords,setsearchedWords] = useState(false);//the word that will be highlighted in the word list
  
  useEffect(() => {
    localStorage.setItem('vocabList', JSON.stringify(vocabList));
    localStorage.setItem('isCollapsed', JSON.stringify(isCollapsed));
  }, [vocabList, isCollapsed]);

 
  

  async function addHandler(e,{word,sentence=inputValue}) {
    setNormalResponse(true);
    try {

      e.preventDefault();
  
      let newVocab = {
        'word': word,
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
      const response = await fetch('https://843t182d14.vicp.fun:443/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then(response => {
        setNormalResponse(true);

        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  setInputValue('');
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
      .then(result => {
        setNormalResponse(false);
        console.log(result);
      })
      .catch((error) => {
        error.message.includes('Failed to fetch')
        && alert('Oops🥹, 服务器走神了，请稍后再试');
      });
   
    }catch(error){
      console.error('Error:', error);
      error.message.includes('NetworkError')&&
      alert('Oops, 网络好像有点不太正常🐌，请稍后再试');
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
      let found = false;
     
      const currentSearchValue = searchValue; // Save the current search value
      vocabList.map((key) => {

        if (key.word === currentSearchValue) { // Use the current search value
          found = true;
          setSearchMeaning(key['解释'])    
        }
      })
      console.log('Value of found:', found);
      if (!found) {
        alert('Oops😬, 没有找到这个单词,请检查拼写错误');
      }
      setSearchValue("");        
    }
    catch (error) {
      console.error('Error:', error);
    }
  }

  function handleWordClick(word,word2S) {
    !searchedWords&&setSubmited({word: word,sentence: inputValue});
    console.log('clicked');
    !searchedWords&&(word2S.style.color = 'red'); 
    !searchedWords&&(word2S.style.backgroundColor = 'yellow');
     setsearchedWords(!searchedWords);
     searchedWords&&(word2S.style.color = 'inherit'); 
     searchedWords&&(word2S.style.backgroundColor = 'inherit'); 
  }


  return (

  <Context.Provider value={{handleWordClick,addHandler, deleteHandler,searchHandler,
  inputValue,submited,setSubmited}}>
    <div className='container'>

    <button className='longerButton' onClick={() => {localStorage.clear();window.location.reload();}}>
    重新加载
    </button>
   
    {!isCollapsed && <div className='word-list'> {
      <Card vocabList={vocabList} />
               
         }


    </div>
    }
     {isCollapsed && <div className=''> {
        
      vocabList.map((key, index) => {
        
            return (
            <ul className='collapsed' style={{
         
        }}>
              <li key={index}>{key['单词']}</li>
              </ul>  );
          
          })
          }
          
      
    </div>
    }    {normalResponse ? <Load /> : null}

    <div className='searchBar'>
    <form className="wordAndSentence"onSubmit={e=>{addHandler(e,submited)}}>
    <InputWithButton showdivide={true}  filled={filled0} handler={deleteHandler} value={inputValue}  type="text"  onChange={
      (e) =>{
       setInputValue(e.target.value);
       setFilled0(e.target.value.length == 0);      
    }
    } />
    </form>

    <form className="searchWord" onSubmit={(e)=>searchHandler(e)}>
      <InputWithButton showdivide={false} filled={filled1} handler={()=>{setSearchMeaning("")}} placeholder='查找生词本的单词' value={searchValue}  type="text" onChange={
      (e) =>{
       setSearchValue(e.target.value);
       setFilled1(e.target.value.length == 0);     
      } 
      }  
    />
    </form>

    </div>
   
  <Button 
  event={isClicked ? '📕' : '📖'} 
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
  