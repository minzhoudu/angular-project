import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  private ingredients: Ingredient[] = [];

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

  // addIngredient(ingredient: Ingredient) {
  //   this.ingredients.push(ingredient);
  //   this.ingredientsChanged.next(this.ingredients.slice());
  // }

  // addIngredients(ingredients: Ingredient[]) {
  //   this.ingredients.push(...ingredients);
  //   this.ingredientsChanged.next(this.ingredients.slice());
  // }

  // updateIngredient(index: number, ingredient: Ingredient) {
  //   this.ingredients[index] = ingredient;
  //   this.ingredientsChanged.next(this.ingredients.slice());
  // }

  deleteIngredient(index: number) {
    this.ingredients = this.ingredients.filter((_, i) => {
      return index !== i;
    });

    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
