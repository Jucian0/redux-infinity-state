import { AnyAction, Store, Dispatch, Middleware, Action } from "redux";

export const middlewareAsync:Middleware<Store, Dispatch<Action>, any> = store => next => action => {
  let syncActivityFinished = false;
  let actionQueue: any[] = [];

  function flushQueue() {
    actionQueue.forEach(a => store.dispatch(a));
    actionQueue = [];
  }

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

