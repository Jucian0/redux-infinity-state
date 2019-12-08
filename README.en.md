# redux-infinity-state

## A package for state management of react redux applications

### Motivation

### Motivação

We know that redux is important part of react ecosystem further if application have a complex flux and asynchronous actions.
With redux the management state and data synchronization between components is easy peasy.

But in many cases the exceeding code around redux ecosystem
is boring and tiring. The sensation increases when we discovery that codes is repetitive especially when create many actions and actions type.

Another factor that discourages the use redux is when you need deal with asynchronous flux, in these cases is necessary at least one library for this job. Redux-Saga, Redux-Thunk or Redux-Observable are good solutions and do this job very well, but the synchronous part keep parted of asynchronous and it make sense, but the code keep confuse and not natural.


### The approach propose

The redux-infinity-state come try to solve these two problems and make redux use more easy and make the code more organized and simple.


#### This is make basically in three stages

##### Create automatically actions

The Actions are functions that basically return a payload and a action type, this type is who define what change will happen in application state.

In conventional mode of redux, it will be necessary a action function for every kind of change you want to make in the state.

With the redux-infinity-state this is automatically realized with corrects types for every actions, includes payload type.


##### Make asynchronous actions as simple as synchronous actions

As mentioned above isn't necessary another library for async actions, redux-infinity-state make it so simple as sync actions.

This is possible with middleware that inject the Dispatch from redux into a async action function.

###### Example of a async flux function with promise:
Ps* `dispatch` are available only async functions.

```
const fetch: Service<TodosState> = ({state, dispatch}) =>
  Axios.get('https://yourapi')
    .then(resp =>resp.data.map(item => item))
    .then(data => dispatch(actions.success(data)))
    .catch(err => dispatch(actions.failure(err.data)))

```

###### Example of a async flux function with Rxjs:
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

As mentioned above the actions are generated automatically with yours types.

Just needing to declare a name for the state context being managed.

###### Example

```
const context = createState({
  name: "todo"
})
```

### Creating a state

This example are using `typescript`, feel free to use `javascript`


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

### Dispatching a action

Redux hook `useDispatch` make this so easy.

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

Is necessary to use middleware `asyncActionMiddleware` to be able to resolve asynchronous flows.

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

Or playground `CodeSandbox`
* https://codesandbox.io/s/github/Jucian0/redux-infinity-state-exemple

