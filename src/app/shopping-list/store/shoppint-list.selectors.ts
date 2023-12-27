import { AppState } from '../../types/State.types';

export const selectShoppingList = (state: AppState) => state.shoppingList;
