import { Dispatch } from 'redux';
import { createReducer } from './createReducer';
import { getType } from './utils';

/**
 * @param TState State is the only true source in the Redux ecosystem, represents the current state of your application. Refer the type of current state your context application.
 * @param TPayload Payload of action is a data value for mutation your state context. Refer then type of payload action, payload type is option if your action not have payload.
 */
export interface ServiceParams<TState, TPayload = undefined> {
  readonly state: TState;
  readonly payload: TPayload;
  readonly dispatch: Dispatch;
};
/**
 * @param  {inferP} ...args
 * @returns never
 */
type GetServiceParams<T> = T extends (
  params: ServiceParams<any, infer P>
) => any
  ? ServiceParams<any, P>['payload']
  : never;

type MethodParams<TState, TPayload> = { state: TState; payload: TPayload };
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
 * @param  {TState} state State is the only true source in the Redux ecosystem, represents the current state of your application. Refer the type of current state your context application.
 * @param  {TPayload} payload Payload of action is a data value for mutation your state context. Refer then type of payload action, payload type is option if your action not have payload.
 */
export type Method<TState, TPayload = undefined> = (
  params: MethodParams<TState, TPayload>
) => TState;

export type Methods<TState, TPayload = any> = {
  [x: string]: Method<TState, TPayload>;
};
/**
 * @param  {TState} state State is the only true source in the Redux ecosystem, represents the current state of your application. Refer the type of current state your context application.
 * @param  {TPayload} payload Payload of action is a data value for mutation your state context. Refer then type of payload action, payload type is option if your action not have payload.
 * @param  {Dispatch} dispatch Dispatches an action. This is the only way to trigger a state change.
 */
export type Service<
  TState,
  TPayload = undefined,
  TReturn = Promise<any>
  > = (params: ServiceParams<TState, TPayload>) => TReturn;

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
  readonly services?: Services<TState>;
}

/**
 * types actions sync
 */

/**
 * @param  {GetParams<T>[1]} payload Payload of action is a data value for mutation your state context
 * @returns string
 */
type WithPayload<T> = (
  payload: GetMethodParams<T>
) => { payload: GetMethodParams<T>; type: string };
/**
 * @param  {string}} =>{The type action defines what changes will be made to the state.
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
 * @param  {string}} =>{The type action defines what changes will be made to the state
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
 * A function that accepts an initial state, an object of methods, and object of services.
 * Methods object is an approach for sync operations.
 * Services object is an approach for async operations.
 *
 * Name of state context is used to generate action types..
 *
 * CreateState automatically generate actions for methods and services.
 *
 *
 * @param  {TypeContext} context Context is an object that contains all its methods, services and initial state and name your state.
 */
export function createState<TypeContext extends Context<TypeContext['state']>>(
  context: TypeContext
) {
  if (context === void 0) {
    context = Object.assign({}, context);
  }

  const actions: Actions<TypeContext['methods']> = Object.assign({});
  const effects: Effects<TypeContext['services']> = Object.assign({});

  /**
   * @param  {TypeContext["methods"]} methods
   */
  const actionCreator = (methods: TypeContext['methods']) => {
    const actionsL = Object.assign({}, actions) as any;
    for (let method in methods) {
      actionsL[method] = (payload: any) => ({
        payload,
        type: getType(context.name, method)
      });
    }

    const ac: Actions<TypeContext['methods']> = Object.assign({});

    return Object.assign(ac, actionsL) as Actions<TypeContext['methods']>;
  };
  /**
   * @param  {TypeContext["services"]} methods
   */
  const effectCreator = (services: TypeContext['services']) => {
    const effectsL = Object.assign({}, effects) as any;
    // tslint:disable-next-line: forin
    for (let service in services) {
      /**
       * @param  {any} payload Async Actions are way to resolve async flux before. 
       * Async Action return a function instead of an action object.
       */
      effectsL[service] = (payload: any) => {
        let action = { payload, type: getType(context.name, service) };
        let effect = (dispatch: Dispatch, state: TypeContext['state']) => {
          dispatch(action);
          return services[service]({ state, payload, dispatch });
        };

        return Object.assign({}, { ...action, effect });
      };
    }

    const ef: Effects<TypeContext['services']> = Object.assign({});

    return Object.assign(ef, effectsL) as Effects<TypeContext['services']>;
  };
  /**
   * @param  {TypeContext["state"]=context.state} state
   * @param  {any} action
   */
  return {
    reducer: (state: TypeContext['state'] = context.state, action: any) =>
      createReducer(state, action, context),
    name: context.name,
    actions: Object.assign(
      actionCreator(context.methods),
      effectCreator(context.services)
    )
  };
}
