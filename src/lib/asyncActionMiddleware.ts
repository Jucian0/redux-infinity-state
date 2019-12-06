import { Middleware, Store, Dispatch, Action } from "redux";

function middleware(payload?: any): Middleware<Store, Dispatch<Action>> {
    return ({ dispatch, getState }) => next => action => {
        if (typeof action === 'function') {
            return action(dispatch, getState(), payload);
        }

        return next(action);
    };
}

const asyncAction: any = middleware();
asyncAction.withExtraArgument = middleware;

export default asyncAction;