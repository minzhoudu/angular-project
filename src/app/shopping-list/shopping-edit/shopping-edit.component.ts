import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm, NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  editMode = false;
  editItemIndex: number;
  editItem: Ingredient;

  @ViewChild('form') slForm: NgForm;
  @ViewChild('name') name: ElementRef;

  constructor(private slService: ShoppingListService) {}

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editItemIndex = index;

        this.editItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name: this.editItem.name,
          amount: this.editItem.amount,
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAddOrEditItem(form: NgForm) {
    this.name.nativeElement.focus();

    //edit ingredient
    if (this.editMode) {
      this.slService.updateIngredient(
        this.editItemIndex,
        new Ingredient(form.value.name, form.value.amount)
      );

      this.editMode = false;
      form.reset();
      return;
    }

    //add new ingredient
    this.slService.addIngredient(
      new Ingredient(form.value.name, form.value.amount)
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
    this.slService.deleteIngredient(this.editItemIndex);
    this.editItemIndex = null;
    this.onClear();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onExitEdit() {
    this.editMode = false;
    this.onClear();
  }
}
