import React from 'react';
import Draggable from 'react-draggable';
import 'react-resizable/css/styles.css';
import '../Card.css';


export default function Card({vocabList}) {
    return vocabList.map((vocab, index) => {
        return (
                <div className="card" >
                    <div className="align">
                        <span className="red"></span>
                        <span className="yellow"></span>
                        <span className="green"></span>
                        <h1>{vocab.word}</h1>
                        <p>{vocab["解释"]}</p>
                    </div>
                </div>
        );
    });
}