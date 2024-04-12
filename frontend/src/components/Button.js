import React, { useState,useContext } from 'react';
import { Context } from './context';

export function Button({event,handler,styles}){
    return <button style={{...styles}} onClick={handler}>{event}  </button>
}

export function DoubleButton({event0,event1}){
    const{submited,setSubmited}= useContext(Context);

    const {addHandler,deleteHandler,filled,} = useContext(Context);
   

    function handleClick0(){
        addHandler(submited);
    }

    function handleClick1(){
        deleteHandler();
    }

    return(
    <div className='doubleButton'>
        <button onClick={handleClick0} disabled={filled} >{event0}</button>
        <button onClick={handleClick1} >{event1}</button>
    </div> );
    
    
}