import { useContext,useEffect  } from "react";
import { Context } from './context';

export default function Dived({str,onWordClick}){
    const {setSubmited} = useContext(Context);
    let list = str.split(' ');

    useEffect(() => {
        if (list.length === 1)
            setSubmited({ word: str, sentence: null });
        else
            setSubmited({ word: null, sentence: str });
    }, [str, setSubmited]);

    return (
        <div>
            {list.map((item, index) => {
                return <span onClick={()=> onWordClick(item)} key={index}>{ `   ${item}  ` }</span>
            })}
        </div>
    )
}
