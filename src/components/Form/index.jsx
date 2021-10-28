import React, { useEffect, useState } from 'react';
import { customAlphabet } from 'nanoid';
import './style.css';

function Form(props) {
    const date = new Date();
    const currentDate = date.toISOString().substring(0, 10);
    const nanoid = customAlphabet('ABCDEF1234567890', 12);

    const [message, setMessage] = useState('');

    const [taskInfo, setTaskInfo] = useState({
        id: props.item ? props.item.id : "",
        title: props.item ? props.item.title : "",
        description: props.item ? props.item.description : "",
        dueDate: props.item ? props.item.dueDate : currentDate,
        piority: props.item ? props.item.piority : "1"
    });

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setTaskInfo({
            ...taskInfo,
            [name]: value
        })
    }

    useEffect(() => {
        if (taskInfo.title) {
            setMessage('');
        }
    }, [taskInfo.title])
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskInfo.title.trim()) {
            const taskList = JSON.parse(localStorage.getItem("task")) ?? [];
            if (!taskInfo.id) {
                taskList.push({
                    ...taskInfo,
                    title: taskInfo.title.trim(),
                    id: nanoid()
                });
                setTaskInfo({
                    id: "",
                    title: "",
                    description: "",
                    dueDate: currentDate,
                    piority: "1"
                })
            } else {
                const index = taskList.findIndex((item) => item.id === taskInfo.id);
                taskList.splice(index, 1, {
                    ...taskInfo,
                    title: taskInfo.title.trim(),
                });
                props.setActiveForm('');
            }
            localStorage.setItem("task", JSON.stringify(taskList));
            props.setData(taskList);
        } else {
            setMessage('Task title is a required field.');
        }
    }

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <input 
                name="title"
                className={`text-input ${message ? 'invalid' : ''}`} 
                type="text" 
                placeholder="Add new task..." 
                value={taskInfo.title}
                onChange={handleChange}
            />
            <div className="message">{message}</div>
            <div className="text">Description</div>
            <textarea 
                name="description"
                className="text-area" 
                cols="30" rows="10"
                value={taskInfo.description}
                onChange={handleChange}
            ></textarea>
            <div className="form-input">
                <div className="form-date">
                    <label htmlFor="">Due Date</label>
                    <input 
                        name="dueDate"
                        className="date-input" 
                        type="date" 
                        min={currentDate}
                        value={taskInfo.dueDate}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-select">
                    <label htmlFor="">Piority</label>
                    <select 
                        name="piority" 
                        className="dropdown" 
                        value={taskInfo.piority} 
                        onChange={handleChange}
                    >
                        <option value="1">normal</option>
                        <option value="2">low</option>
                        <option value="3">high</option>
                    </select>
                </div>
            </div>
            {
                taskInfo.id ? (
                    <button 
                        className="submit-btn" 
                        type="submit"
                    >
                        Update
                    </button>
                ) : (
                    <button 
                        className="submit-btn" 
                        type="submit"
                    >
                        Add
                    </button>
                )
            }
        </form>
    );
}

export default Form;