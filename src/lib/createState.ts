import { Dispatch } from "redux"
import { createReducer } from "./createReducer"
import { getType } from "./utils"
/**
 * @param  {TState} state
 * @param  {TPayload} payload
 */
export type Method<TState, TPayload = undefined> =
    (state: TState, payload: TPayload) => TState

export type Methods<TState, TPayload = undefined> =
    { [x: string]: Method<TState, TPayload>; }
/**
 * @param  {TState} state
 * @param  {TPayload} payload
 * @param  {Dispatch} dispatch
 */
export type Service<TState, TPayload = undefined> =
    (state: TState, payload: TPayload, dispatch: Dispatch) => Promise<any>

export type Services<TState, TPayload = undefined> =
    { [x: string]: Service<TState, TPayload>; }

export interface Context<TState> {
    /**
    * The name. Used to namespace the generated action types.
    */
    name: string;
    /**
    * The state to be returned by the reducer.
    */
    state: TState;
    /**
    * A mapping from action types to action-type-specific
    * functions. These reducers should have existing action types used
    * as the keys, and action creators will _not_ be generated.
    */
    methods: Methods<TState>;
    services?: Services<TState>;
}
/**
 * @param  {inferP} ...args
 * @returns never
 */
type GetParams<T> = T extends (...args: infer P) => any ? P : never;
/**
 * @param  {GetParams<T>[1]} payload
 * @returns string
 */
type WithPayload<T> = (payload: GetParams<T>[1]) => { payload: GetParams<T>[1], type: string }
/**
 * @param  {string}} =>{type
 * @returns string
 */
type WithoutPayload = () => { type: string }

type TAction<TA> = GetParams<TA>[1] extends undefined ? WithoutPayload : WithPayload<TA>

export type Actions<TContext> = {
    [K in Extract<keyof TContext, string>]: TAction<TContext[K]>
}

export type Action<TP> = { type: string, payload?: TP, dispatch: Dispatch }

/**
 * A function that accepts an initial state, an object of methods, and object of services.
 * Methods object is an approach for sync operations.
 * Services object is an approach for async operations. 
 * 
 * Name of state context is used to generate action types..
 * 
 * CreateState automatically generate actions for methods and services.
 * 
 *
 * @param  {TypeContext} context
 */
export function createState<TypeContext extends
    Context<TypeContext["state"]>>(context: TypeContext) {

    if (context === void 0) {
        context = Object.assign({}, context)
    }

    const actions: Actions<TypeContext["methods"]> = Object.assign({})
    const effects: Actions<TypeContext["services"]> = Object.assign({})

    /**
     * @param  {TypeContext["methods"]} methods
     */
    const actionCreator = (methods: TypeContext["methods"]) => {
        const actionsL = Object.assign({}, actions) as any
        for (let method in methods) {
            actionsL[method] = (payload: any) => ({ payload, type: getType(context.name, method) })
        }

        const ac: Actions<TypeContext["methods"]> = Object.assign({})

        return Object.assign(ac, actionsL) as Actions<TypeContext["methods"]>
    }
    /**
     * @param  {TypeContext["services"]} methods
     */
    const effectCreator = (methods: TypeContext["services"]) => {
        const effectsL = Object.assign({}, effects) as any
        for (let method in methods) {
            effectsL[method] = (payload: any) => ({ payload, type: getType(context.name, method) })
        }

        const ef: Actions<TypeContext["services"]> = Object.assign({})

        return Object.assign(ef, effectsL) as Actions<TypeContext["services"]>
    }
    /**
     * @param  {TypeContext["state"]=context.state} state
     * @param  {any} action
     */
    return {
        reducer: (state: TypeContext["state"] = context.state, action: any) =>
            createReducer(
                state,
                action,
                context
            ),
        name: context.name,
        actions: Object.assign(
            actionCreator(context.methods),
            effectCreator(context.services)
        )
    }
}