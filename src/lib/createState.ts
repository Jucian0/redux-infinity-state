import { Dispatch } from 'redux';
import { createReducer } from './createReducer';
import { getType } from './utils';

/**
 * @param TState Redux is a single source of truth,property State represents the current state of your application. Refer to the type of current state your context application.
 * @param TPayload The payload of action is a data value for a mutation in your state context. Refer then type of payload action, payload type is optional if your action not has a payload.
 * {@link https://juciano.gitbook.io/redux-infinity-state/usage/creating-asynchronous-handles}
 */
export interface ServiceParams<TState, TPayload = undefined> {
  readonly state: TState;
  readonly payload: TPayload;
  readonly dispatch: Dispatch;
}
/**
 * @param  {inferP} ...args
 * @returns never
 */
type GetServiceParams<T> = T extends (
  params: ServiceParams<any, infer P>
) => any
  ? ServiceParams<any, P>['payload']
  : never;

/**
* @param  {TState} state Redux is a single source of truth,property State represents the current state of your application. Refer to the type of current state your context application.
* @param  {TPayload} payload Payload of action is a data value for mutation your state context. Refer then type of payload action, payload type is option if your action not have payload.
* {@link https://juciano.gitbook.io/redux-infinity-state/usage/creating-handles}
*/
export type MethodParams<TState, TPayload> = {
  state: TState;
  payload: TPayload;
};
/**
 * @param  {inferP} ...args
 * @returns never
 */
type GetMethodParams<T> = T extends (params: MethodParams<any, infer P>) => any
  ? MethodParams<any, P>['payload']
  : never;
/**
 * @param  {any} ...args
 * @returns any
 */
//type GetReturnType<T> = T extends (...args: any) => infer R ? R : any;

/**
 * @param  {TState} state Redux is a single source of truth,property State represents the current state of your application. Refer to the type of current state your context application.
 * @param  {TPayload} payload Payload of action is a data value for mutation your state context. Refer then type of payload action, payload type is option if your action not have payload.
 * {@link https://juciano.gitbook.io/redux-infinity-state/usage/creating-handles}
 */
export type Method<TState, TPayload = undefined> = (
  params: MethodParams<TState, TPayload>
) => TState;

export type Methods<TState, TPayload = any> = {
  [x: string]: Method<TState, TPayload>;
};
/**
 * @param  {TState} state Redux is a single source of truth,property State represents the current state of your application. Refer to the type of current state your context application.
 * @param  {TPayload} payload The payload of action is a data value for a mutation in your state context. Refer then type of payload action, payload type is optional if your action not has a payload.
 * @param  {Dispatch} dispatch Dispatches an action. This is the only way to trigger a state change.
 * {@link https://juciano.gitbook.io/redux-infinity-state/usage/creating-asynchronous-handles}
 */
export type Service<TState, TPayload = undefined, TReturn = Promise<any>> = (
  params: ServiceParams<TState, TPayload>
) => TReturn;

export type Services<TState, TPayload = any, TReturn = any> = {
  [x: string]: Service<TState, TPayload, TReturn>;
};

export interface Context<TState> {
  /**
   * @param name The name. Used to namespace the generated action types.
   */
  readonly name: string;
  /**
   * @param state The state to be returned by the reducer.
   */
  readonly state: TState;
  /**
   * @param methods A mapping from action types to action-type-specific
   * functions. These methods should have existing action types used
   * as the keys, and action creators will _not_ be generated.
   */
  readonly methods: Methods<TState>;
  /**
   * @param services A mapping from action types to action-type-specific
   * functions. These services should have existing action types used
   * as the keys, and action creators will _not_ be generated.
   */
  readonly services?: Services<any>;
}

/**
 * types actions sync
 */

/**
 * @param  {GetParams<T>[1]} payload Payload of action is a data value for mutation your state context.
 * @returns string
 */
type WithPayload<T> = (
  payload: GetMethodParams<T>
) => { payload: GetMethodParams<T>; type: string };
/**
 * @param  {string}} =>{The type of action defines what changes will be made to the state.
 * @returns string
 */
type WithoutPayload = () => { type: string };

type TAction<TA> = GetMethodParams<TA> extends undefined
  ? WithoutPayload
  : WithPayload<TA>;

export type Actions<TContext> = {
  [K in Extract<keyof TContext, string>]: TAction<TContext[K]>;
};

/**
 *
 * types async functions
 */
/**
 * @param  {GetParams<T>[1]} payload
 */
type EffectWithPayload<T> = (
  payload: GetServiceParams<T>
) => {
  readonly payload: GetServiceParams<T>;
  readonly type: string;
  readonly effect: <TDispatch, TState>(
    dispatch: TDispatch,
    state: TState
  ) => Service<TState, GetServiceParams<T>>;
};
/**
 * @param  {string}} =>{The type of action defines what changes will be made to the state
 * @returns string
 */
type EffectWithoutPayload = () => {
  type: string;
  effect: <TDispatch, TState>(
    dispatch: TDispatch,
    state: TState
  ) => Service<TState>;
};

type TEffect<TA> = GetServiceParams<TA> extends undefined | null
  ? EffectWithoutPayload
  : EffectWithPayload<TA>;

export type Effects<TContext> = {
  [K in Extract<keyof TContext, string>]: TEffect<TContext[K]>;
};

export type Effect<TP> = { type: string; payload?: TP; dispatch: Dispatch };

/**
* A function that accepts an initial state, an object of methods, and the object of services.
* Methods object is an approach for sync operations.
* Services object is an approach for async operations.
*
* Name of state context is used to generate action types.
*
* `createState` automatically generates action creator for methods and services handlers.
*
* {@link https://juciano.gitbook.io/redux-infinity-state/usage/registering-handlers}
* @param  {TypeContext} context A context is an object that contains all its methods, services, the initial state, and the name of your state.
* `createState` returns a object with `reducer`, `actions` and `types`.
*
* `reduce` (also called a *reducing function*) is a function that accepts
* an accumulation and a value and returns a new accumulation. They are used
* to reduce a collection of values down to a single value.
*
* `actions` Action creators are exactly that—functions that create actions. It's easy to conflate the terms “action” and “action creator”, so do your best to use the proper term.
*
* `types` is an object with all types of actions registered, 
* with both information you are can to change the state of modals, toast, 
* and components of loading on views.
*/
export function createState<TypeContext extends Context<TypeContext['state']>>(
  context: TypeContext
) {
  if (context === void 0) {
    context = Object.assign({}, context);
  }

  /**
   * @param  {TypeContext["methods"]} methods
   */
  const actionCreator = (methods: TypeContext['methods']) => {

    return Object.keys(methods).reduce<Effects<TypeContext['methods']>>((acc, ac) => {
      return Object.assign(acc, {
        [ac]: (payload: any) => ({
          payload,
          type: getType(context.name, ac)
        })
      })
    }, Object.assign({}))
  };

  /**
   * @param  {TypeContext["services"]} methods
   */
  const effectCreator = (services: TypeContext['services']) => {

    return Object.keys(services as {}).reduce<Effects<TypeContext['services']>>((acc, ac) => {
      return Object.assign(acc, {
        /**
         * @param  {any} payload Async Actions are a way to resolve async flux before.
         * Async Action returns a function instead of an action object.
         */
        [ac]: (payload: any) => {
          let action = { payload, type: getType(context.name, ac) };
          let effect = (dispatch: Dispatch, state: TypeContext['state']) => {
            dispatch(action);
            return (services as any)[ac]({ state, payload, dispatch });
          };

          return Object.assign({}, { ...action, effect });
        }
      })
    }, Object.assign({}))

  };

  /**
   * Generate a object with all actions type.
   * @param actions object of actions.
   */
  function actionsType<T>(actions: T): { [k in keyof typeof actions]: k } {

    return Object.keys(actions).reduce((acc, ac) => {

      return Object.assign(acc, {
        [ac]: `${context.name}/${ac}`
      })

    }, Object.assign({}))
  };

  return {
    reducer: (state: TypeContext['state'] = context.state, action: any) =>
      createReducer(state, action, context),
    name: context.name,
    actions: Object.assign(
      actionCreator(context.methods),
      effectCreator(context.services)
    ),
    types: actionsType(Object.assign(
      actionCreator(context.methods),
      effectCreator(context.services)
    ))
  };
}