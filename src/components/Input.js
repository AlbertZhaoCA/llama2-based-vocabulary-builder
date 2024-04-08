import { Button, DoubleButton } from "./Button";
import { Context } from "./context";
import { useContext } from "react";


export function Input({ value,type, onChange,placeholder='回车也可以查找' }) {
  const {handler0} = useContext(Context);
  return (
    <input placeholder={placeholder} value={value} type={type} onChange={onChange} onKeyDown={(e)=>{if(e.key==='Enter')handler0()}}/>
  );
}

export function InputWithButton({ type, value, onChange }) {
  

return (

    <div className="input">
        <Input placeholder="请输入单词..." type={type} value={value} onChange={onChange} />
        <DoubleButton  event0='查找' event1='删除' />
    </div>
  );
}