# redux-infinity-state

## Um pacote de gerenciamento de estado para aplicações react redux

### Motivação
Todos nos sabemos que redux é um ótimo aliado na construção de aplicações react com fluxo de dados mais complexos, com ele a tarefa de gerenciar o estado da aplicação e o sincronismo de dados entre os componentes torna-se muito fácil.

Porem em muitos casos o excesso de código em torno do redux torna o uso dele desestimulante, essa sensação aumenta ao perceber que a maioria desse código é repetitivo.

Outro fator que desestimula o uso do redux é quando é necessário usar fluxos assíncronos, nesses casos é necessário fazer uso de um pacote extra para lidar com os fluxos assíncronos, exemplo Redux-Saga, Redux-Thunk, Redux-Observable. Todos esses pacotes executam essa tarefa muito bem. Porem ao usar essas soluções a parte síncrona fica separada da assíncrona, e por mais que isso faça sentido, não aparenta ser um fluxo natural.


### A solução proposta

O redux-infinity-state vem para tentar resolver esses dois pontos e tornar o uso do redux mais simples e deixar o código organizado de forma mais logica.

#### Isso é feito basicamente em três etapas


##### Criar ações automaticamente

As ações são funções que basicamente devolvem um payload e um tipo que é responsável por dizer ao redux qual mudança deve ser feita no estado da aplicação.

No modo convencional de uso do redux seria necessário criar uma função de ação para cada tipo de mudança que se deseja realizar no state.

Com o  redux-infinity-state isso é feito automaticamente com as tipagens correta para ações com payload.
##### Trazer os fluxos assíncronos junto ao fluxo síncrono
Como mencionado anteriormente não é necessário uma biblioteca especifica para lidar com fluxos assíncronos, pois isso é resolvido de forma parecida como se resolve um fluxo síncrono.

Isso é possível utilizando um middleware que injeta o Dispatch do redux dentro de uma função especifica para resolver fluxos assíncronos.

###### Exemplo de uma função com fluxo assíncrono usando Promise:
Ps* `dispatch` esta disponível apenas em funções que resolvem fluxos assíncronos.

```
const fetch: Service<TodosState> = ({state, dispatch}) =>
  Axios.get('https://yourapi')
    .then(resp =>resp.data.map(item => item))
    .then(data => dispatch(actions.success(data)))
    .catch(err => dispatch(actions.failure(err.data)))

```

###### Exemplo de uma função com fluxo assíncrono usando Rxjs:
Ps* `dispatch` esta disponível apenas em funções que resolvem fluxos assíncronos.

```
const fetchRxjs: Service<TodosState, undefined, Subscription> = ({dispatch}) =>
  from(Axios.get('https://yourapi'))
    .subscribe(
      resp => dispatch(actions.success(resp.data)),
      err => dispatch(actions.failure(err.data))
    )

```

###### Exemplo de uma função com fluxo síncrono:

```
const success:Method<TodosState, Array<Todo>> = ({state, payload}) =>
  [...state, ...payload]
```

##### Não é necessário declarar uma lista de tipo

Como mencionado anteriormente as ações são geradas automaticamente e com elas os tipos específicos de cada uma.

Necessitando apenas declarar um nome para o contexto do estado que esta sendo gerenciado.

###### Exemplo

```
const context = createState({
  name: "todo"
})
```

### Criando um state

No exemplo esta sendo utilizado o `typescript`, sinta-se a vontade para utilizar `javascript`


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

### Disparando uma ação

Com os hooks disponíveis na nova versão do redux fica muito fácil.

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

### Adicionando o middleware

É necessário adicionar o `asyncActionMiddleware` para conseguir resolver os fluxos assíncronos.

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

### Exemplo de implementação 

VOcê pode ver o código fonte de um exemplo de implementação com fluxos assíncronos aqui:
 * https://github.com/Jucian0/redux-infinity-state-exemple

Ou pode brincar com a aplicação no `CodeSandbox`
* https://codesandbox.io/s/github/Jucian0/redux-infinity-state-exemple

