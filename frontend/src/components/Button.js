import React, {useContext } from 'react';
import { Context } from './context';

export function Button({event,styles,handler}){
    
    return <button onClick={handler} style={{...styles}}>{event}  </button>
}

export function DoubleButton({event0,event1,handler}){

    const {filled} = useContext(Context);
   

    return(
    <div >
        <button type='submit' disabled={filled} >{event0}</button>
        <button  onClick={handler} type='button' >{event1}</button>
    </div> );
    
    
}