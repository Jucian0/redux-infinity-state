import test from 'ava';
import { currentAction } from './currentAction';


test('must change currentAction to action type passed', t => {
   const result = currentAction('add/Todo', {
      type: 'remove/todo'
   })
   t.is(result, 'remove/todo');
});