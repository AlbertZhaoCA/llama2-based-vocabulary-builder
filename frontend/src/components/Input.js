import { Button, DoubleButton } from "./Button";
import { useState } from "react";
import { Context } from "./context";
import { useContext } from "react";
import  "../Input.css";
import Dived from "./divideWords";

export function Input({showdivide,filled,handler,value,type,onChange,placeholder='回车也可以查找'}) {
  const [isFocused,setIsFocused] = useState(false);
  const {inputValue,handleWordClick} = useContext(Context);
  
  const handleOnFocus = () => { 
    setIsFocused(true); 
}; 

const handleBlur = () => { 
    setIsFocused(false); 
}; 
  return (
    <>
    <div className="icard">
      <div className="chat-header">输入单词或句子</div>
      <div className="chat-window">
      {showdivide&& <Dived str={inputValue} onWordClick={handleWordClick} />}
      </div>
      <div class="chat-input">
      <input placeholder={placeholder} value={value} type={type} onChange={onChange} onFocus={handleOnFocus}
      onBlur={handleBlur} className="message-inpu"/>        
    <DoubleButton 
  event0='🔍' 
  event1='🧹' 
  handler={handler} 
  filled={filled} 
/>
        </div>
        </div>
      </>
  );
}

export function InputWithButton({showdivide,filled, type, value, onChange,handler}) {
return (

    <div style={{display:"flex",flexDirection:"row"}}>
        <Input showdivide={showdivide} filled={filled} handler={handler} placeholder="请输入单词..." type={type} value={value} onChange={onChange} />
    </div>
  );
}