import { AnyAction, Store, Dispatch, Middleware, Action } from "redux";
/**
 * @param  {} {actionQueue.forEach(a=>store.dispatch(a
 * @param  {AnyAction} ;actionQueue=[];}functiondispatch(action
 */
export const middlewareAsync:Middleware<Store, Dispatch<Action>, any> = store => next => action => {
  let syncActivityFinished = false;
  let actionQueue: any[] = [];
  /**
   * @param  {} {actionQueue.forEach(a=>store.dispatch(a
   */
  function flushQueue() {
    actionQueue.forEach(a => store.dispatch(a));
    actionQueue = [];
  }
  /**
   * @param  {AnyAction} action
   */
  function dispatch(action: AnyAction) {

    if (!action || typeof action !== "object") {
      throw new Error('Action must be a object')
    }

    actionQueue = actionQueue.concat([action]);

    if (syncActivityFinished) {
      flushQueue();
    }
  }


  const actionWithAsyncDispatch =
    Object.assign({}, action, { dispatch });

  next(actionWithAsyncDispatch);
  syncActivityFinished = true;
  flushQueue();
};

