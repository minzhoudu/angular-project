import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs-compat';
import { Ingredient } from '../shared/ingredient.model';
import { selectShoppingList } from './store/shoppint-list.selectors';
import { startEditing } from './store/shoppint-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.ingredients = this.store.select(selectShoppingList);
  }

  onEditItem(index: number): void {
    // this.slService.startedEditing.next(index);
    this.store.dispatch(startEditing({ index }));
  }
}
