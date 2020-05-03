import { Middleware, Store, Dispatch, Action } from 'redux';
/**
 * @param  {any} payload? The payload of action is a data value for mutation in your state context.
 */
function middleware(): Middleware<Store, Dispatch<Action>> {
  /**
   * @param  {} {dispatch Dispatches an action. This is the only way to trigger a state change.
   * @param  {} getState} This function returns the current state of your application.
   * @param  {} =>next=>action=>{if(typeofaction==='function'
   * @param  {} {returnaction(dispatch
   * @param  {} getState(
   * @param  {} payload The payload of action is a data value for a mutation in your state context.
   * @param  {} ;}returnnext(action
   */
  return ({ dispatch, getState }) => next => action => {
    if (action && action.effect && typeof action.effect === 'function') {
      return action.effect(dispatch, getState());
    }

    return next(action);
  };
}
/**
 * A middleware to solve async actions
 */
const asyncActionMiddleware = Object.assign(middleware(), {
  withExtraArgument: middleware
})

export { asyncActionMiddleware };