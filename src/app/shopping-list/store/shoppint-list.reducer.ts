import { createReducer, on } from '@ngrx/store';

import { ShoppingListState } from '../../types/State.types';
import {
  addIngredient,
  addIngredients,
  deleteIngredient,
  startEditing,
  stopEditing,
  updateIngredient,
} from './shoppint-list.actions';

const initialState: ShoppingListState = {
  ingredients: [],
  editedIngredient: null,
  editedIngredientIndex: null,
};

export const shoppingListReducer = createReducer(
  initialState,

  on(addIngredient, (state, action) => {
    return {
      ...state,
      ingredients: [...state.ingredients, action.ingredient],
    };
  }),

  on(addIngredients, (state, action) => {
    return {
      ...state,
      ingredients: [...state.ingredients, ...action.ingredients],
    };
  }),

  on(updateIngredient, (state, action) => {
    return {
      ...state,
      ingredients: state.ingredients.map((ingredient, index) =>
        index === state.editedIngredientIndex ? action.ingredient : ingredient
      ),
      editedIngredient: null,
      editedIngredientIndex: null,
    };
  }),

  on(deleteIngredient, (state, action) => {
    return {
      ...state,
      ingredients: state.ingredients.filter((_, index) => {
        return index !== state.editedIngredientIndex;
      }),
      editedIngredient: null,
      editedIngredientIndex: null,
    };
  }),

  on(startEditing, (state, action) => {
    return {
      ...state,
      editedIngredientIndex: action.index,
      editedIngredient: { ...state.ingredients[action.index] },
    };
  }),

  on(stopEditing, (state) => {
    return {
      ...state,
      editedIngredientIndex: null,
      editedIngredient: null,
    };
  })
);
