# Add the middleware

It's necessary to use the middleware `asyncActionMiddleware` to be able to resolve asynchronous flows.  


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

