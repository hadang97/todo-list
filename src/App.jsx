import { useState } from 'react';
import './App.css';
import NewTask from './components/NewTask';
import TodoList from './components/TodoList';

function App() {
  const taskList = JSON.parse(localStorage.getItem("task")) ?? [];
  const [data, setData] = useState(taskList);
  console.log(data);
  return (
    <div className="App">
      <div className="todo-form">
        <NewTask setData={setData} />
        <TodoList data={data} setData={setData} />
      </div>
    </div>
  );
}

export default App;
