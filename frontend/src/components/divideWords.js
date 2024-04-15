import { useContext,useEffect,useRef } from "react";
import { Context } from './context';
import React from "react";

export default function Dived({str,onWordClick}){
    const {setSubmited} = useContext(Context);
    let list = str.split(' ');
    const spanRefs = useRef(list.map(() => React.createRef()));
    useEffect(() => {
        if (list.length === 1)
            setSubmited({ word: str, sentence: null });
        else
            setSubmited({ word: null, sentence: str });
    }, [str, setSubmited]);

    return (
        <div>
            {list.filter(item => item.length > 0).map((item, index) => {
            return <span ref={spanRef => spanRefs.current[index] = spanRef} onClick={()=> onWordClick(item,spanRefs.current[index])} key={index}>{ `   ${item}  ` }</span>
})}
        </div>
    )
}
