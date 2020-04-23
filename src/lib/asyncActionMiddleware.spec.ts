import test from 'ava';
import { asyncActionMiddleware } from './asyncActionMiddleware';
import { isFunction } from 'util';
import { Dispatch, AnyAction } from 'redux';

const doDispatch = () => { };
const doGetState = () => { };
const nextHandler = asyncActionMiddleware({
  dispatch: doDispatch as Dispatch,
  getState: doGetState as () => Dispatch<AnyAction>
});

test('must return a function to handle next', t => {
  const result = isFunction(nextHandler);

  t.is(result, true);
  t.is(nextHandler.length, 1);
});

test('must return a function to handle action', t => {
  const actionHandler = isFunction(nextHandler(doDispatch as Dispatch));

  t.is(actionHandler, true);
  t.is(nextHandler(doDispatch as Dispatch).length, 1);
});

test('must pass action to next if not a function', t => {
  const actionObj = {};

  const action = action => {
    t.deepEqual(action, actionObj);
  }

  const actionHandler = nextHandler(action as Dispatch<AnyAction>);

  actionHandler(actionObj);
});

test('must return the return value of next if not a function', t => {
  const expected = 'redux';
  const action = () => expected
  const actionHandler = nextHandler(action as Dispatch<AnyAction>);

  const outcome = actionHandler({});

  t.is(outcome, expected);
});

test('must return value as expected if a function', t => {
  const expected = 'rocks';
  const action = () => expected

  const actionHandler = nextHandler(action as Dispatch<AnyAction>);

  const outcome = actionHandler(() => expected);

  t.is(outcome, expected);
});
