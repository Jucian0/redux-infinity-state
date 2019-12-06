import { Dispatch } from 'redux';
import { createReducer } from './createReducer';
import { getType } from './utils';

type ServiceParams<TState, TPayload> = {
  state: TState;
  payload: TPayload;
  dispatch: Dispatch;
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
type GetReturnType<T> = T extends (...args: any) => infer R ? R : any;

/**
 * @param  {TState} state State is the only true source in the Redux ecosystem, represents the current state of your application.
 * @param  {TPayload} payload Payload of action is a data value for mutation your state context.
 */
export type Method<TState, TPayload = undefined> = (
  params: MethodParams<TState, TPayload>
) => TState;

export type Methods<TState, TPayload = any> = {
  [x: string]: Method<TState, TPayload>;
};
/**
 * @param  {TState} state State is the only true source in the Redux ecosystem, represents the current state of your application.
 * @param  {TPayload} payload Payload of action is a data value for mutation your state context.
 * @param  {Dispatch} dispatch Dispatches an action. This is the only way to trigger a state change.
 */
export type Service<
  TState,
  TPayload = undefined,
  TReturn = Promise<any>
> = (params: {
  state: TState;
  payload: TPayload;
  dispatch: Dispatch;
}) => TReturn;

export type Services<TState, TPayload = any, TReturn = any> = {
  [x: string]: Service<TState, TPayload, TReturn>;
};

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

export type Action<TP> = { type: string; payload?: TP; dispatch: Dispatch };

/**
 *
 * types async functions
 */
/**
 * @param  {GetParams<T>[1]} payload
 */
type EffectWithPayload<T> = (payload: GetServiceParams<T>) => GetReturnType<T>;
/**
 * @param  {string}} =>{The type action defines what changes will be made to the state
 * @returns string
 */
type EffectWithoutPayload<T> = () => GetReturnType<T>;

type TEffect<TA> = GetServiceParams<TA> extends undefined | null
  ? EffectWithoutPayload<TA>
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
 * @param  {TypeContext} context Context is an object that contains all its methods, services and initial state.
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
    for (let service in services) {
      /**
       * @param  {any} payload Async Actions are way to resolve async flux before. Async Action return a function instead of an action object.
       */
      effectsL[service] = (payload: any) =>
        /**
         * @param  {Dispatch} dispatch
         * @param  {TypeContext["state"]} state
         */
        (dispatch: Dispatch, state: TypeContext['state']) => {
          dispatch({ payload, type: getType(context.name, service) });
          return services[service]({ state, payload, dispatch });
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
