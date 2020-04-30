# In the components

## Dispatch Action

Using hook `useDispatch`

[https://react-redux.js.org/7.1/api/hooks\#usedispatch](https://react-redux.js.org/7.1/api/hooks#usedispatch)

```jsx
import { useDispatch } from "react-redux";
import { actions } from "../../store/states/todos";

const TodoForm = () => {

    const [inputText, setInputText] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(actions.add(inputText))
        setInputText('');
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input 
                    data-testid="todo-input" 
                    value={inputText} 
                    onChange={(e) => setInputText(e.target.value)} 
                />
                <button 
                    data-testid="add-button" 
                    type="submit">Novo</button>
                <button 
                    data-testid="fetch-button" 
                    type="button" 
                    onClick={() => dispatch(actions.fetch())}>
                    Async Promise
                </button>
                <button 
                    data-testid="reset-button" 
                    type="button" 
                    onClick={() => dispatch(actions.reset())}>
                    RESET
                </button>
            </form>
        </>
    );
}

export default TodoForm;
```

## Selector State

Using hook `useSelector`

[https://react-redux.js.org/7.1/api/hooks\#useselector](https://react-redux.js.org/7.1/api/hooks#useselector)

```jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../store";

const TodoList = () => {
  const todos = useSelector(state => state.todos);

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.complete ? <s>{todo.text}</s> : todo.text}
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
```

