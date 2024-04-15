import { useContext, useEffect, useRef, useMemo } from "react";
import { Context } from './context';
import React from "react";
import { v4 as uuidv4 } from 'uuid';

export default function Dived({str,onWordClick}){
    const {setSubmited} = useContext(Context);
    const list = useMemo(() => str.split(' ').map(word => ({ id: uuidv4(), word })), [str]);
    const wordRefs = useRef([]);

    useEffect(() => {
        wordRefs.current = list.map(() => React.createRef());
        if (list.length === 1){
            setSubmited({ word: str, sentence: null });
        }
        else{
            setSubmited({ word: null, sentence: str });
        }
    }, [str, setSubmited, list]);

    return (
        <div>
            {list.filter(item => item.word.length > 0).map((item, index) => (
                <span 
                    ref={el => wordRefs.current[index] = el} 
                    onClick={() => onWordClick(item.word, wordRefs.current[index])} 
                    key={item.id}
                >
                    {`   ${item.word}  `}
                </span>
            ))}
        </div>
    );
}