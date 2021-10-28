import React from 'react';
import Form from '../Form';
import './style.css';

function NewTask(props) {
    return (
        <div className="new-task">
            <div className="title">New Task</div>
            <Form setData={props.setData}/>
        </div>
    );
}

export default NewTask;