import { AnyAction } from "redux";

/**
 * This reducer gets the type of current action dispatched in your 
 * application and put in your redux state. 
 * 
 * This is a way for you to know what is happens and make decisions.
 * 
 * The createState function provides an object with all types of actions registered, 
 * with both information you are can to change the state of modals, toast, 
 * and components of loading on views.
 * 
 * @param state Current State of current action.
 * @param action Actions are payloads of information that send data from your application to your store. 
 * 
 * They are the only source of information for the store. You send them to the store using store.dispatch().
 */
function currentAction(state: String = "@@INIT", action: AnyAction) {
   return action.type || state
}

export { currentAction }