# Creating Asynchronous Handles

## Service

Service is a name of asynchronous handlers. It provides a way to solve asynchronous actions.

Every service solves one action type, for this to happen he receives three parameters: state, payload and dispatch.

> `dispatch` is a function of the Redux store. You call `store.dispatch` to dispatch an action. This is the only way to trigger a state change.
>
> react-redux documentation

Service not dispatch action inside a reducer, for many reasons, the first is handlers isn't a reducer, the second service solves the problem with asynchronous actions like Redux Thunk.

It is all that he needs for your job.

#### Example of an async flux function with promise:

```typescript
const fetch = ({state, dispatch}) =>
  Axios.get('https://your-api')
    .then(resp =>resp.data.map(item => item))
    .then(data => dispatch(actions.success(data)))
    .catch(err => dispatch(actions.failure(err.data)))
```

You probably want to process or transform data before saving on the state. This is the place and you can use the Async Await approach.

```typescript
const fetch = async ({ dispatch }) => {
  try {
    const { data } = await Axios.get('https://your-api');
    dispatch(actions.success(data))
  } catch (e) {
    dispatch(actions.failure(e.data))
  }
}
```

### Typescript

With typescript is necessary to infer types to the handler, state, and payload. The type for asynchronous Handles it's called Service

Typescript example:

```typescript
export interface Todo {
  id: number
  text: string
  complete: boolean
}

export type TodosState = Array<Todo>

const INITIAL_STATE: TodosState = []

const fetch: Service<TodosState, undefined> = async ({ dispatch }) => {
  try {
    const { data } = await Axios.get('https://your-api');
    dispatch(actions.success(data))
  } catch (e) {
    dispatch(actions.failure(e.data))
  }
}
```

