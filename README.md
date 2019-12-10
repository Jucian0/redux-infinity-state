# redux-infinity-state

## A package for state management of react redux applications

## Portuguese
https://github.com/Jucian0/redux-infinity-state/blob/master/README.pt.md

## Install

`yarn add redux-infinity-state`

`npm install --save redux-infinity-state`

### Motivation


We all know that redux is an important part of React ecosystem, even if the application have complex flux and asynchronous actions.
With Redux, the management state and data synchronization between components is eased.

But in many cases the exceeding code around redux ecosystem makes the code hard to understand and maintain. This sensation increases when we realize that the code is repetitive, especially when many actions are written.

Another factor that discourages the use of Redux is when we need to deal with asynchronous flows. In these cases is necessary at least one of the following libraries to solve the problem: Redux-Saga, Redux-Thunk or Redux-Observable. They are good solutions and do this job very well, but the synchronous code is splitted from the asynchronous, which is a nice approach, but the code become confuse and not natural.


### The proposed solution

The redux-infinity-state come to solve some of the problems mentioned and makes Redux use easier, making your code more organized and simple.

#### Its use have basically three stages

##### Create actions automatically

Actions are functions that basically return a payload and an action type, being that the action type is the element who is in charge to define what change will happen in application state.

In the conventional use of Redux, it will be necessary an action function for every kind of change you want to make in the state.

With the redux-infinity-state this is automatically realized with correct types for every actions, including payload type.


##### Make asynchronous actions as simple as synchronous actions

As mentioned above, isn't necessary another library for async actions, redux-infinity-state makes it so simple as sync actions.

This is possible with a middleware that injects the Dispatch from Redux into an async action function.

###### Example of an async flux function with promise:
Ps*: `dispatch` are available only for async functions.

```
const fetch: Service<TodosState> = ({state, dispatch}) =>
  Axios.get('https://yourapi')
    .then(resp =>resp.data.map(item => item))
    .then(data => dispatch(actions.success(data)))
    .catch(err => dispatch(actions.failure(err.data)))

```

###### Example of an async flux function with Rxjs:
Ps* `dispatch` are available only async functions.

```
const fetchRxjs: Service<TodosState, undefined, Subscription> = ({dispatch}) =>
  from(Axios.get('https://yourapi'))
    .subscribe(
      resp => dispatch(actions.success(resp.data)),
      err => dispatch(actions.failure(err.data))
    )

```

###### Example of a sync flux function:

```
const success:Method<TodosState, Array<Todo>> = ({state, payload}) =>
  [...state, ...payload]
```

##### No need to declare action type list

As mentioned above the actions are generated automatically with your types.

Its only needed to declare a name for the state context being managed.

###### Example

```
const context = createState({
  name: "todo"
})
```

### Creating a state

This example uses `typescript`, feel free to use `javascript`


```
export interface Todo {
  id: number
  text: string
  complete: boolean
}

export type TodosState = Array<Todo>

const INITIAL_STATE: TodosState = []

const add: Method<TodosState, string> = ({state, payload}) =>
  [
    ...state,
    { id: Math.random(), text: payload, complete: false }
  ]

const toggle: Method<TodosState, number> = ({state, payload}) =>
  state.map(
    (todo: Todo) =>
      todo.id === payload ? { ...todo, complete: !todo.complete } : todo
  )

const remove: Method<TodosState, number> = ({state, payload}) =>
  state.filter((todo: Todo) => todo.id !== payload)

const fetch: Service<TodosState> = ({dispatch}) =>
  Axios.get('https://yourapi')
    .then(resp =>resp.data.map(item => item))
    .then(data => dispatch(actions.success(data)))
    .catch(err => dispatch(actions.failure(err.data)))

const success:Method<TodosState, Array<Todo>> = ({state, payload}) =>
  [...state, ...payload]

export const { actions, reducer } = createState({
  state: INITIAL_STATE,
  name: "todo",
  methods: {
    reset,
    failure,
    success,
    remove,
    add,
    toggle
  },
  services: {
    fetch
  }
})
```

### Dispatching an action

With hooks available in the new version of Redux(`useDispatch`), its use is simplified.

```
const dispatch = useDispatch();
```

```
<form onSubmit={handleSubmit}>
    <input value={inputText} onChange={(e) => setInputText(e.target.value} />
    <button type="submit">Novo</button>
    <button type="button" onClick={() =>dispatch(actions.fetchPromise())} >Async Promise</button>
    <button type="button" onClick={() => dispatch(actions.reset())}>RESET</button>
</form>
```

### Add the middleware

It's necessary to use the middleware `asyncActionMiddleware` to be able to resolve asynchronous flows.

```
const store = createStore(
    reducers, 
    appState,
    composeEnhancers(
        applyMiddleware(
            asyncActionMiddleware
        )
));

export default store;
```

### Writing Tests

https://redux.js.org/recipes/writing-tests

### Example of implementation

You can see the implementation code here:
 * https://github.com/Jucian0/redux-infinity-state-exemple

Or play with the code using `CodeSandbox`
* https://codesandbox.io/s/github/Jucian0/redux-infinity-state-exemple

