import { Middleware, Store, Dispatch, Action } from 'redux';
/**
 * @param  {any} payload? Payload of action is a data value for mutation your state context.
 */
function middleware(payload?: any): Middleware<Store, Dispatch<Action>> {
  /**
   * @param  {} {dispatch Dispatches an action. This is the only way to trigger a state change.
   * @param  {} getState} These function return the current state of your application
   * @param  {} =>next=>action=>{if(typeofaction==='function'
   * @param  {} {returnaction(dispatch
   * @param  {} getState(
   * @param  {} payload Payload of action is a data value for mutation your state context.
   * @param  {} ;}returnnext(action
   */
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState(), payload);
    }

    return next(action);
  };
}
/**
 * A middleware to solve async actions
 */
const asyncActionMiddleware: any = middleware();
asyncActionMiddleware.withExtraArgument = middleware;

export default asyncActionMiddleware;
