import test from 'ava';
import { asyncActionMiddleware } from './asyncActionMiddleware';
import { isFunction } from 'util';

const doDispatch = () => { };
const doGetState = () => { };
const nextHandler = asyncActionMiddleware({
  dispatch: doDispatch,
  getState: doGetState
});

test('must return a function to handle next', t => {
  const result = isFunction(nextHandler);

  t.is(result, true);
  t.is(nextHandler.length, 1);
});

test('must return a function to handle action', t => {
  const actionHandler = isFunction(nextHandler());

  t.is(actionHandler, true);
  t.is(nextHandler().length, 1);
});

test('must run the given action function with dispatch and getState', t => {
  const actionHandler = nextHandler();

  actionHandler((dispatch, getState) => {
    t.deepEqual(dispatch, doDispatch);
    t.deepEqual(getState, doGetState)
  });
});

test('must pass action to next if not a function', t => {
  const actionObj = {};

  const actionHandler = nextHandler(action => {
    t.deepEqual(action, actionObj);
  });

  actionHandler(actionObj);
});

test('must return the return value of next if not a function', t => {
  const expected = 'redux';
  const actionHandler = nextHandler(() => expected);

  const outcome = actionHandler();

  t.is(outcome, expected);
});

test('must return value as expected if a function', t => {
  const expected = 'rocks';
  const actionHandler = nextHandler();

  const outcome = actionHandler(() => expected);

  t.is(outcome, expected);
});

test('must be invoked synchronously if a function', t => {
  const actionHandler = nextHandler();
  let mutated = 0;

  actionHandler(() => mutated++);
  t.is(mutated, 1);
});

test('must pass the third argument', t => {
  const extraArg = { lol: true };
  asyncActionMiddleware.withExtraArgument(extraArg)({
    dispatch: doDispatch,
    getState: doGetState
  })()((dispatch, getState, arg) => {
    t.deepEqual(dispatch, doDispatch);
    // t.deepEqual(getState, doGetState);
    console.log(getState);
    t.deepEqual(arg, extraArg);
  });
});
