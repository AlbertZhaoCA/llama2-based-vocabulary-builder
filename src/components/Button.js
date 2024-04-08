import React, { useState,useContext } from 'react';
import { Context } from './context';

export function Button({event,handler}){
    return <button onClick={handler}>{event}</button>
}

export function DoubleButton({event0,event1}){
    const {handler0,handler1,filled} = useContext(Context);
    function handleClick0(){
        handler0();
    }

    function handleClick1(){
        handler1();
    }

    return(
    <div className='doubleButton'>
        <button onClick={handleClick0} disabled={filled} >{event0}</button>
        <button onClick={handleClick1} >{event1}</button>
    </div> );
    
    
}