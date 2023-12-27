import { createAction, props } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';

export const addIngredient = createAction(
  '[Shopping List] Add Ingredient',
  props<{ ingredient: Ingredient }>()
);
