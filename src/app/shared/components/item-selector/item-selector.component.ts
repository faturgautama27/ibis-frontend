import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, switchMap, startWith, of, map, catchError } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ItemService } from '../../../features/item-master/services/item.service';
import { ItemEnhanced } from '../../../features/item-master/models/item-enhanced.model';
import { ItemCategory } from '../../../features/item-master/models/item-category.enum';

export interface ItemSelection {
  item: ItemEnhanced;
  quantity?: number;
  unitPrice?: number;
  notes?: string;
}

/**
 * Reusable Item Selector Component
 * Provides searchable dropdown for selecting items from master data
 * Supports filtering by category and search functionality
 */
@Component({
  selector: 'app-item-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    InputTextModule,
    ButtonModule
  ],
  template: `
    <div class="item-selector">
      <!-- Search Mode -->
      @if (mode === 'search') {
        <div class="flex gap-2">
          <div class="flex-1">
            <input 
              pInputText 
              [formControl]="searchControl"
              [placeholder]="placeholder"
              class="w-full"
              [disabled]="disabled"
            />
          </div>
          <button 
            pButton 
            icon="pi pi-search" 
            (click)="onSearchClick()"
            [disabled]="disabled || !searchControl.value"
            type="button"
          ></button>
        </div>
      }

      <!-- Dropdown Mode -->
      @if (mode === 'dropdown') {
        <div>
          <p-select
            [options]="filteredItems$ | async"
            optionLabel="displayText"
            optionValue="item"
            [placeholder]="placeholder"
            [filter]="true"
            filterBy="displayText"
            [showClear]="true"
            [disabled]="disabled"
            class="w-full"
            (onChange)="onItemSelect($event.value)"
            [(ngModel)]="selectedItem"
          >
            <ng-template pTemplate="item" let-option>
              <div class="flex flex-col">
                <div class="font-semibold">{{ option.item.item_code }} - {{ option.item.item_name }}</div>
                <div class="text-sm text-gray-600">
                  HS: {{ option.item.hs_code }} | Unit: {{ option.item.unit }}
                  @if (option.item.price) {
                    <span class="ml-2">
                      Price: {{ option.item.price | currency:'IDR':'symbol':'1.0-0' }}
                    </span>
                  }
                </div>
              </div>
            </ng-template>
          </p-select>
        </div>
      }

      <!-- Selected Item Display -->
      @if (selectedItem && showSelectedItem) {
        <div class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="font-semibold text-blue-900">{{ selectedItem.item_code }} - {{ selectedItem.item_name }}</div>
              <div class="text-sm text-blue-700 mt-1">
                <span>HS Code: {{ selectedItem.hs_code }}</span>
                <span class="ml-4">Unit: {{ selectedItem.unit }}</span>
                @if (selectedItem.price) {
                  <span class="ml-4">
                    Price: {{ selectedItem.price | currency:'IDR':'symbol':'1.0-0' }}
                  </span>
                }
              </div>
              @if (selectedItem.description) {
                <div class="text-sm text-blue-600 mt-1">
                  {{ selectedItem.description }}
                </div>
              }
            </div>
            <button 
              pButton 
              icon="pi pi-times" 
              (click)="clearSelection()"
              [text]="true"
              severity="secondary"
              size="small"
              type="button"
            ></button>
          </div>
        </div>
      }

      <!-- Loading State -->
      @if (loading) {
        <div class="text-center py-2">
          <i class="pi pi-spin pi-spinner text-blue-600"></i>
          <span class="ml-2 text-sm text-gray-600">Loading items...</span>
        </div>
      }

      <!-- No Results -->
      @if (!loading && (filteredItems$ | async)?.length === 0 && searchControl.value) {
        <div class="text-center py-2 text-gray-500 text-sm">
          No items found matching "{{ searchControl.value }}"
        </div>
      }
    </div>
  `
})
export class ItemSelectorComponent implements OnInit {
  private itemService = inject(ItemService);

  @Input() mode: 'search' | 'dropdown' = 'dropdown';
  @Input() placeholder = 'Search or select item...';
  @Input() disabled = false;
  @Input() category?: ItemCategory;
  @Input() showSelectedItem = true;
  @Input() selectedItem: ItemEnhanced | null = null;

  @Output() itemSelected = new EventEmitter<ItemEnhanced>();
  @Output() itemCleared = new EventEmitter<void>();

  searchControl = new FormControl('');
  loading = false;
  filteredItems$: Observable<{ item: ItemEnhanced; displayText: string }[]> = of([]);

  ngOnInit(): void {
    this.setupItemSearch();
  }

  private setupItemSearch(): void {
    this.filteredItems$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.searchItems(query || ''))
    );
  }

  private searchItems(query: string): Observable<{ item: ItemEnhanced; displayText: string }[]> {
    if (query.length < 2 && this.mode === 'search') {
      return of([]);
    }

    this.loading = true;

    const filters = {
      searchQuery: query,
      category: this.category,
      active: true
    };

    return this.itemService.getItems(filters).pipe(
      map(response => {
        this.loading = false;
        const items = response.items.map(item => ({
          item,
          displayText: `${item.item_code} - ${item.item_name}`
        }));
        return items;
      }),
      catchError(error => {
        this.loading = false;
        console.error('Error loading items:', error);
        return of([]);
      })
    );
  }

  onSearchClick(): void {
    if (this.searchControl.value) {
      this.searchItems(this.searchControl.value).subscribe();
    }
  }

  onItemSelect(selectedItem: ItemEnhanced): void {
    this.selectedItem = selectedItem;
    this.itemSelected.emit(selectedItem);
  }

  clearSelection(): void {
    this.selectedItem = null;
    this.searchControl.setValue('');
    this.itemCleared.emit();
  }
}