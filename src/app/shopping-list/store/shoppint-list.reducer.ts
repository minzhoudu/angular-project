import { createReducer, on } from '@ngrx/store';
import { addIngredient } from './shoppint-list.actions';

const initialState = {
  ingredients: [],
};

export const shoppingListReducer = createReducer(
  initialState,
  on(addIngredient, (state, action) => {
    return {
      ...state,
      ingredients: [...state.ingredients, action.ingredient],
    };
  })
);
