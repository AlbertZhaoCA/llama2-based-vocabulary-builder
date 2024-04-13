import { Button, DoubleButton } from "./Button";
import { useState } from "react";
import { Context } from "./context";
import { useContext } from "react";

export function Input({value,type,onChange,placeholder='回车也可以查找'}) {
  const [isFocused,setIsFocused] = useState(false);
  
  const handleOnFocus = () => { 
    setIsFocused(true); 
}; 

const handleBlur = () => { 
    setIsFocused(false); 
}; 
  return (
    <input placeholder={placeholder} value={value} type={type} onChange={onChange} onFocus={handleOnFocus} 
      onBlur={handleBlur} />
  );
}

export function InputWithButton({ type, value, onChange,handler}) {
return (

    <div style={{display:"flex",flexDirection:"row"}}>
        <Input placeholder="请输入单词..." type={type} value={value} onChange={onChange} />
        <DoubleButton handler={handler}  event0='查' event1='删' />
    </div>
  );
}