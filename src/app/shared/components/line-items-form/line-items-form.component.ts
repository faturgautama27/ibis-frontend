import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ItemSelectorComponent } from '../item-selector/item-selector.component';
import { ItemEnhanced } from '../../../features/item-master/models/item-enhanced.model';
import { ItemCategory } from '../../../features/item-master/models/item-category.enum';

export interface LineItemData {
  lineNumber: number;
  itemId?: string;
  itemCode: string;
  itemName: string;
  hsCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice?: number;
  deliveryDate?: Date;
  notes?: string;
}

/**
 * Enhanced Line Items Form Component
 * Provides a sophisticated interface for managing line items with item selection
 */
@Component({
  selector: 'app-line-items-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    TextareaModule,
    TableModule,
    ToastModule,
    ItemSelectorComponent
  ],
  providers: [MessageService],
  template: `
    <p-card>
      <ng-template pTemplate="header">
        <div class="p-4 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Line Items</h3>
            <p class="text-sm text-gray-600 mt-1">Add items to your {{ orderType }}</p>
          </div>
          <button 
            pButton 
            label="Add Item" 
            icon="pi pi-plus" 
            (click)="addLineItem()"
            [outlined]="true"
            type="button"
          ></button>
        </div>
      </ng-template>

      <!-- Empty State -->
      @if (lineItems.length === 0) {
        <div class="text-center py-12">
          <div class="flex flex-col items-center gap-4">
            <i class="pi pi-inbox text-6xl text-gray-300"></i>
            <div>
              <h4 class="text-lg font-medium text-gray-900 mb-2">No items added yet</h4>
              <p class="text-gray-600 mb-4">Start by adding your first line item</p>
              <button 
                pButton 
                label="Add First Item" 
                icon="pi pi-plus" 
                (click)="addLineItem()"
                type="button"
              ></button>
            </div>
          </div>
        </div>
      }

      <!-- Line Items List -->
      @if (lineItems.length > 0) {
        <div>
          <div class="space-y-6">
            @for (item of lineItems.controls; track i; let i = $index) {
              <div 
                [formGroup]="getFormGroup(i)"
                class="border border-gray-200 rounded-lg p-6 bg-gray-50"
              >
                <!-- Line Item Header -->
                <div class="flex justify-between items-center mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {{ i + 1 }}
                    </div>
                    <h4 class="font-semibold text-gray-900">Line Item {{ i + 1 }}</h4>
                  </div>
                  <button 
                    pButton 
                    icon="pi pi-trash" 
                    (click)="removeLineItem(i)"
                    severity="danger"
                    [outlined]="true"
                    [text]="true"
                    size="small"
                    type="button"
                  ></button>
                </div>

                <!-- Item Selection -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Select Item *
                  </label>
                  <app-item-selector
                    mode="dropdown"
                    [category]="itemCategory"
                    [selectedItem]="getSelectedItem(i)"
                    (itemSelected)="onItemSelected(i, $event)"
                    (itemCleared)="onItemCleared(i)"
                  ></app-item-selector>
                </div>

                <!-- Item Details Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <!-- Quantity -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <p-inputNumber
                      formControlName="quantity"
                      [min]="0.01"
                      [step]="1"
                      [showButtons]="true"
                      buttonLayout="horizontal"
                      spinnerMode="horizontal"
                      decrementButtonClass="p-button-secondary"
                      incrementButtonClass="p-button-secondary"
                      class="w-full"
                      (onInput)="calculateTotal(i)"
                    ></p-inputNumber>
                  </div>

                  <!-- Unit -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Unit *
                    </label>
                    <input 
                      pInputText 
                      formControlName="unit"
                      placeholder="e.g., pcs, kg, m"
                      class="w-full"
                      readonly
                    />
                  </div>

                  <!-- Unit Price -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Unit Price *
                    </label>
                    <p-inputNumber
                      formControlName="unitPrice"
                      mode="currency"
                      currency="IDR"
                      locale="id-ID"
                      [min]="0"
                      class="w-full"
                      (onInput)="calculateTotal(i)"
                    ></p-inputNumber>
                  </div>

                  <!-- Total Price -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Total Price
                    </label>
                    <p-inputNumber
                      formControlName="totalPrice"
                      mode="currency"
                      currency="IDR"
                      locale="id-ID"
                      [disabled]="true"
                      class="w-full"
                    ></p-inputNumber>
                  </div>

                  <!-- Delivery Date -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Date
                    </label>
                    <p-datepicker
                      formControlName="deliveryDate"
                      dateFormat="dd/mm/yy"
                      [showIcon]="true"
                      class="w-full"
                      appendTo="body"
                    ></p-datepicker>
                  </div>

                  <!-- Notes -->
                  <div class="md:col-span-3">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea 
                      pInputTextarea 
                      formControlName="notes"
                      rows="2"
                      placeholder="Additional notes for this item..."
                      class="w-full"
                    ></textarea>
                  </div>
                </div>

                <!-- Item Info Display -->
                @if (getSelectedItem(i)) {
                  <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <div class="text-sm">
                      <span class="font-medium text-blue-900">HS Code:</span>
                      <span class="text-blue-700 ml-1">{{ getSelectedItem(i)?.hs_code }}</span>
                      @if (getSelectedItem(i)?.description) {
                        <span class="ml-4">
                          <span class="font-medium text-blue-900">Description:</span>
                          <span class="text-blue-700 ml-1">{{ getSelectedItem(i)?.description }}</span>
                        </span>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Summary -->
          <div class="mt-6 p-4 bg-gray-100 rounded-lg">
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-600">
                <span class="font-medium">{{ lineItems.length }}</span> items • 
                <span class="font-medium">{{ getTotalQuantity() }}</span> total quantity
              </div>
              <div class="text-lg font-semibold text-gray-900">
                Total: {{ getTotalAmount() | currency:'IDR':'symbol':'1.0-0' }}
              </div>
            </div>
          </div>
        </div>
      }
    </p-card>

    <p-toast></p-toast>
  `
})
export class LineItemsFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  @Input() formArray!: FormArray;
  @Input() orderType = 'order';
  @Input() itemCategory?: ItemCategory;
  @Input() readonly = false;

  @Output() itemsChanged = new EventEmitter<LineItemData[]>();

  selectedItems: Map<number, ItemEnhanced> = new Map();

  ngOnInit(): void {
    if (!this.formArray) {
      throw new Error('FormArray is required for LineItemsFormComponent');
    }
  }

  get lineItems(): FormArray {
    return this.formArray;
  }

  getFormGroup(index: number): FormGroup {
    return this.lineItems.at(index) as FormGroup;
  }

  addLineItem(): void {
    const lineItem = this.fb.group({
      lineNumber: [this.lineItems.length + 1],
      itemId: [''],
      itemCode: ['', Validators.required],
      itemName: ['', Validators.required],
      hsCode: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(0.01)]],
      unit: ['', Validators.required],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      totalPrice: [0],
      deliveryDate: [null],
      notes: ['']
    });

    this.lineItems.push(lineItem);
    this.emitChanges();

    this.messageService.add({
      severity: 'success',
      summary: 'Item Added',
      detail: `Line item ${this.lineItems.length} added successfully`
    });
  }

  removeLineItem(index: number): void {
    this.lineItems.removeAt(index);
    this.selectedItems.delete(index);

    // Renumber remaining items
    this.lineItems.controls.forEach((control, i) => {
      control.get('lineNumber')?.setValue(i + 1);
    });

    // Update selected items map
    const newSelectedItems = new Map<number, ItemEnhanced>();
    this.selectedItems.forEach((item, oldIndex) => {
      if (oldIndex > index) {
        newSelectedItems.set(oldIndex - 1, item);
      } else if (oldIndex < index) {
        newSelectedItems.set(oldIndex, item);
      }
    });
    this.selectedItems = newSelectedItems;

    this.emitChanges();

    this.messageService.add({
      severity: 'info',
      summary: 'Item Removed',
      detail: 'Line item removed successfully'
    });
  }

  onItemSelected(index: number, item: ItemEnhanced): void {
    const lineItem = this.lineItems.at(index);

    lineItem.patchValue({
      itemId: item.id,
      itemCode: item.item_code,
      itemName: item.item_name,
      hsCode: item.hs_code,
      unit: item.unit,
      unitPrice: item.price || 0
    });

    this.selectedItems.set(index, item);
    this.calculateTotal(index);
    this.emitChanges();
  }

  onItemCleared(index: number): void {
    const lineItem = this.lineItems.at(index);

    lineItem.patchValue({
      itemId: '',
      itemCode: '',
      itemName: '',
      hsCode: '',
      unit: '',
      unitPrice: 0,
      totalPrice: 0
    });

    this.selectedItems.delete(index);
    this.emitChanges();
  }

  getSelectedItem(index: number): ItemEnhanced | null {
    return this.selectedItems.get(index) || null;
  }

  calculateTotal(index: number): void {
    const lineItem = this.lineItems.at(index);
    const quantity = lineItem.get('quantity')?.value || 0;
    const unitPrice = lineItem.get('unitPrice')?.value || 0;
    const totalPrice = quantity * unitPrice;

    lineItem.get('totalPrice')?.setValue(totalPrice);
    this.emitChanges();
  }

  getTotalQuantity(): number {
    return this.lineItems.controls.reduce((total, control) => {
      return total + (control.get('quantity')?.value || 0);
    }, 0);
  }

  getTotalAmount(): number {
    return this.lineItems.controls.reduce((total, control) => {
      return total + (control.get('totalPrice')?.value || 0);
    }, 0);
  }

  private emitChanges(): void {
    const items: LineItemData[] = this.lineItems.controls.map(control => control.value);
    this.itemsChanged.emit(items);
  }
}