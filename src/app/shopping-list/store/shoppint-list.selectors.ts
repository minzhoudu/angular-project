import { Ingredient } from '../../shared/ingredient.model';

export const selectShoppingList = (state: {
  shoppingList: { ingredients: Ingredient[] };
}) => state.shoppingList;
