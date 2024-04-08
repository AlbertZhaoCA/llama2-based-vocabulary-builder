import { Button, DoubleButton } from "./Button";


export function Input({ value,type, onChange }) {
  return (
    <input value={value} type={type} onChange={onChange} />
  );
}

export function InputWithButton({ type, value, onChange }) {
  

return (

    <div>
        <Input type={type} value={value} onChange={onChange} />
        <DoubleButton  event0='add' event1='delete' />
    </div>
  );
}