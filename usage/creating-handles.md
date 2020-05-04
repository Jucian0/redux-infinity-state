# Creating Synchronous Handles

## Methods

Method is the name of handlers synchronous. It provides a way to solve synchronous actions.

Every method solves one action type, for this to happen he receives two parameters: state and payload.

It is all that he needs for your job.

```typescript
const sum = ({state, payload}) => state + payload

const subtract = ({state, payload}) => state - payload
```

Realizes that the type of action in a manipulator is not necessary, this is possible because every manipulator corresponds to a type of action.

```javascript
/*
payload shape
{ [input.name]:input.value }
*/

const setInput = ({state, payload})=>({
        ...state,
        form:{
            ...state.form,
            ...payload
        }
    })
```

### Typescript

With typescript is necessary to infer types to the handler, state, and payload. The type for Synchronous Handles it's called Method

Typescript example:

```typescript
const sum:Method<number, number> = ({state, payload}) => state + payload

const subtract<number, number> = ({state, payload}) => state - payload
```

```typescript
interface Form{
    name: string
    age: number
    email:string
}

interface State{
    ...state...
    form:Form
}

type Input = { [input: string]: string }

const setInput:Method<State, Input> = ({state, payload})=>({
        ...state,
        form:{
            ...state.form,
            ...payload
        }
    })
```

