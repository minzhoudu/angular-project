import { createAction, props } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';

export const addIngredient = createAction(
  '[Shopping List] Add Ingredient',
  props<{ ingredient: Ingredient }>()
);

export const addIngredients = createAction(
  '[Shopping List] Add Ingredients',
  props<{ ingredients: Ingredient[] }>()
);

export const updateIngredient = createAction(
  '[Shopping List] Update Ingredient',
  props<{ ingredient: Ingredient }>()
);

export const deleteIngredient = createAction(
  '[Shopping List] Delete Ingredient',
);

export const startEditing = createAction(
  '[Shopping List] Start Editing',
  props<{ index: number }>()
);

export const stopEditing = createAction('[Shopping List] Stop Editing');
