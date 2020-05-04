# Getting started

## Installation

Redux infinity is a complement a redux library, for this reason, it is necessary to have a redux library in your React project:

```
$ yarn add redux-infinity-state
```

## Add the middleware

Middleware is a function between two parts of a flux. It's able to solve or transform data before coming to the second part.

It's necessary to use the middleware `asyncActionMiddleware` to be able to resolve asynchronous actions.

```typescript
const store = createStore(
    reducers, 
    appState,
    composeEnhancers(
        applyMiddleware(
            asyncActionMiddleware
        )
));

export default store;
```

Everything is ready now.



