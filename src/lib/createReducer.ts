import { Context } from './createState';
import { getMethodName } from './utils';
import { AnyAction } from 'redux';
/**
 * @param  {TState} state Current State of your context Application.
 * @param  {TAction} action Actions are payloads of information that send data from your application to your store. They are the only source of information for the store. You send them to the store using store.dispatch().
 * @param  {Context<TState>} context A context is an object that contains all its methods, services, and initial state.
 */
export function createReducer<TState, TAction extends AnyAction>(
  state: TState,
  action: TAction,
  context: Context<TState>
) {
  if (!action || !action.type) {
    return state;
  }

  const handlers = Object.assign({}, context.methods);
  const method = handlers[getMethodName(action.type, context.name)];

  if (!method) {
    return state;
  }
  /**
   * @param  {} {state Current State of your context Application.
   * @param  {action.payload}} The payload of action is a data value for mutation in your state context.
   */
  return method({ state, payload: action.payload });
}
