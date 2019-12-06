import { Action, Context } from './createState';
import { getMethodName } from './utils';
/**
 * @param  {TState} state Current State of yur context Application
 * @param  {TAction} action Actions are payloads of information that send data from your application to your store. They are the only source of information for the store. You send them to the store using store.dispatch().
 * @param  {Context<TState>} context Context is an object that contains all its methods, services and initial state. 
 */
export function createReducer<TState, TAction extends Action<any>>(
  state: TState,
  action: TAction,
  context: Context<TState>
) {

  if (!action || !action.type) {
    return state;
  }

  const resolvers = Object.assign({}, context.methods);
  const method =
    resolvers[getMethodName(action.type, context.name)];

  if (!method) {
    return state;
  }
  /**
   * @param  {} {state Current State of yur context Application
   * @param  {action.payload}} Payload of action is a data value for mutation your state context.
   */
  return method({ state, payload: action.payload });

}
