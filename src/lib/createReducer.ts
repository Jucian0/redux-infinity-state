import { Action, Context } from "./createState";
import { getMethodName } from "./utils";
/**
 * @param  {TState} state
 * @param  {TAction} action
 * @param  {Context<TState>} context
 */
export function createReducer<TState, TAction extends Action<any>>
    (state: TState, action: TAction, context: Context<TState>) {

    if (!action || !action.type) {
        return state
    }

    const resolvers = Object.assign(context.methods, context.services)
    const method:any = resolvers[getMethodName(action.type, context.name)] || resolvers['DEFAULT']

    if (!method) {
        return state
    }

    let newState = method(
        state,
        action.payload,
        action.dispatch
    )
    
    if (newState && typeof newState.then !== 'function') {
        return newState
    }

    return state

}