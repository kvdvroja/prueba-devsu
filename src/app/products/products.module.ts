import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent,
    DeleteModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
