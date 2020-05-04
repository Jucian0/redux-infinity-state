# Registering Handlers

## Creating Reducer and Actions

The `createState` receives an object with properties to create a reducer and his actions.

```typescript
export const { actions, reducer } = createState({
  state: INITIAL_STATE,
  name: "todo",
  methods: {
    failure, // sync handler
    success
  },
  services: {
    fetch // async handler
  }
})
```



