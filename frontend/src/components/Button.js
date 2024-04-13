import React, {useContext } from 'react';
import { Context } from './context';

export function Button({event,styles,handler}){
    return <button onClick={handler} style={{...styles}}>{event}  </button>
}

export function DoubleButton({event0,event1}){

    const {filled} = useContext(Context);
   

    return(
    <div className='doubleButton'>
        <button disabled={filled} >{event0}</button>
        <button>{event1}</button>
    </div> );
    
    
}