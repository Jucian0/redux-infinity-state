# Testing

## 

## Testing Handlers Synchronous

The handler function should be pure, for this reason, testing is easily:

```typescript
import { INITIAL_STATE, actions, reducer } from "."
import Axios from "axios"
import { AnyAction } from "redux"

describe("Test Methods Todos State", () => {

    const todoText = "Todo Test"

    it("Test AddTodo", () => {

        const initialState = INITIAL_STATE
        const addTodoResult = reducer(initialState, actions.add(todoText))
        const result = addTodoResult.some(todo => todo.text === todoText)

        expect(result).toBeTruthy()
    })
})
```

