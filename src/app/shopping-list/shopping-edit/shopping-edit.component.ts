import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { NgForm, NgModel } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import {
  addIngredient,
  deleteIngredient,
  stopEditing,
  updateIngredient,
} from '../store/shoppint-list.actions';
import { selectShoppingList } from '../store/shoppint-list.selectors';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  editMode = false;
  editItem: Ingredient;

  @ViewChild('form') slForm: NgForm;
  @ViewChild('name') name: ElementRef;

  constructor(private slService: ShoppingListService, private store: Store) {}

  ngOnInit() {
    this.store.select(selectShoppingList).subscribe((state) => {
      if (state.editedIngredientIndex === null) {
        this.editMode = false;
        return;
      }

      this.editMode = true;
      this.editItem = state.editedIngredient;

      this.slForm.setValue({
        name: this.editItem.name,
        amount: this.editItem.amount,
      });
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(stopEditing());
  }

  onAddOrEditItem(form: NgForm) {
    this.name.nativeElement.focus();

    //edit ingredient
    if (this.editMode) {
      // this.slService.updateIngredient(
      //   this.editItemIndex,
      //   new Ingredient(form.value.name, form.value.amount)
      // );

      this.store.dispatch(
        updateIngredient({
          ingredient: new Ingredient(form.value.name, form.value.amount),
        })
      );

      this.onClear();
      return;
    }

    //add new ingredient
    // this.slService.addIngredient(
    //   new Ingredient(form.value.name, form.value.amount)
    // );

    this.store.dispatch(
      addIngredient({
        ingredient: new Ingredient(form.value.name, form.value.amount),
      })
    );

    form.reset();
  }

  onAmountChangeValidator(amount: NgModel) {
    amount.valueChanges.subscribe((value) => {
      if (value < 0) {
        amount.control.setValue(0);
      }
    });
  }

  onDelete() {
    // this.slService.deleteIngredient(this.editItemIndex);
    this.store.dispatch(deleteIngredient());

    this.onClear();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(stopEditing());
  }

  onExitEdit() {
    this.onClear();
  }
}
