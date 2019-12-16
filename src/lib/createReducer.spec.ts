import { ServiceParams } from './createState';
import test from 'ava';
import { createReducer } from './createReducer';

const context = {
  name: 'test',
  state: 0,
  methods: {
    add: ({ state, payload }: ServiceParams<number, number>) => state + payload
  }
};

test('must return a state + payload', t => {
  const result = createReducer(10, { type: 'add', payload: 1 }, context);
  t.is(result, 11);
});

test('must return a state without mutation if action type is wunknow', t => {
  const result = createReducer(10, { type: '.', payload: 1 }, context);
  t.is(result, 10);
});

test('must return a state if action is undefined', t => {
  const result = createReducer(10, { type: undefined, payload: 1 }, context);
  t.is(result, 10);
});
