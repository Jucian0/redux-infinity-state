import { Middleware, Store, Dispatch, Action } from 'redux';
/**
 * @param  {any} payload? Payload of action is a data value for mutation your state context.
 */
function middleware(): Middleware<Store, Dispatch<Action>> {
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
    if (action?.effect && typeof action.effect === 'function') {
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

