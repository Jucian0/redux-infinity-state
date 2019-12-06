import { Service, Method, createState } from '..';

const add: Service<Array<any>, string, Promise<any>> = ({
  state
}) =>
  new Promise((exec, reject) => {
    exec(state);
    reject();
  });

const adeus: Service<Array<any>> = ({ state }) =>
  new Promise((exec, reject) => {
    exec(state);
    reject();
  });

const remove: Method<Array<any>, string> = ({ state, payload }) => [
  ...state,
  payload
];
const set: Method<Array<any>> = ({ state }) => [...state];

const { actions } = createState({
  name: 'Teste',
  state: [],
  methods: {
    set,
    remove
  },
  services: {
    add,
    adeus
  }
});

actions.add('ABC');
actions.remove('ABC');
actions.set();
actions.adeus();
