import React, { useEffect, useRef, useState } from 'react';
import Form from '../Form';
import './style.css';

function TodoList(props) {
    const [activeForm, setActiveForm] = useState('');
    const [checked, setChecked] = useState([]);

    const handleCheck = (id) => {
        setChecked(prev => {
            const isChecked = checked.includes(id);
            if (isChecked) {
                return checked.filter(item => item !== id);
            } else {
                return [...prev, id];
            }
        });
    }

    useEffect(() => {
        if (props.data.length === 0) {
            setChecked([]);
        }
    }, [props.data])

    const timeoutRef = useRef(null);
    const [keyword, setKeyword] = useState('');

    const handleDelete = (id) => {
        const taskList = JSON.parse(localStorage.getItem("task")) ?? [];
        const filterResult = taskList.filter(item => !id.includes(item.id));
        localStorage.setItem("task", JSON.stringify(filterResult));

        if (keyword) {
            const searchResult = handleSearch();
            props.setData(searchResult);
        } else {
            props.setData(filterResult);
        }

        if (id.length === 1) {
            const isChecked = checked.includes(id[0]);
            if (isChecked) {
                handleCheck(id[0]);
            } 
        } else {
            setChecked([]);
        }
    }

    const handleSearch = () => {
        const taskList = JSON.parse(localStorage.getItem("task")) ?? [];
        const result = taskList.filter(item => {
            return item.title.toLowerCase().includes(keyword.trim().toLowerCase());
        })
        return result;
    }
    
    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            const taskList = JSON.parse(localStorage.getItem("task")) ?? [];
            if (keyword.trim()) {
                const searchResult = handleSearch();
                props.setData(searchResult);
            } else {
                props.setData(taskList);
            }
        }, 500);

        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [keyword]);

    return (
        <div className="todo-list">
            <div className="todo-content">
                <div className="title">To Do List</div>
                <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search..." 
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                />
                {
                    props.data.length > 0 && props.data.map(item => (
                        <div key={item.id} className="todo-item">
                            <div className="todo-item-title">
                                <div className="checkbox-input">
                                    <input 
                                        checked={checked.includes(item.id)} 
                                        onChange={() => handleCheck(item.id)} 
                                        type="checkbox" 
                                    />
                                    <span className="todo-item-text">{item.title}</span>
                                </div>
                                <div className="action-btn">
                                    <button 
                                        className="btn detail-btn"
                                        onClick={() => {
                                            if (activeForm !== item.id) {
                                                setActiveForm(item.id);
                                            } else {
                                                setActiveForm('');
                                            }
                                        }} 
                                    >
                                        Detail
                                    </button>
                                    <button 
                                        onClick={() => handleDelete([item.id])} 
                                        className="btn remove-btn"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                            <div className={`todo-item-detail ${activeForm === item.id ? 'active' : ''}`}>
                                <Form item={item} setData={props.setData} setActiveForm={setActiveForm} />    
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className={`action ${checked.length ? "" : "hidden"}`}>
                <div className="action-title">Bulk Action:</div>
                <div className="action-btn">
                    <button className="btn done-btn">Done</button>
                    <button 
                        onClick={() => handleDelete(checked)} 
                        className="btn remove-btn"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TodoList;