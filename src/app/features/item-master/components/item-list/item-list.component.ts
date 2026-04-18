import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

// Enhanced Components
import { ItemEnhanced } from '../../models/item-enhanced.model';
import { ItemCategory } from '../../models/item-category.enum';
import { ItemActions } from '../../../../store/item/item.actions';
import {
    selectFilteredItems,
    selectItemLoading,
    selectItemFilters,
    selectRawMaterialCount,
    selectFinishedGoodCount
} from '../../../../store/item/item.selectors';
import { EnhancedCardComponent, EnhancedTableComponent, PageHeaderComponent, StatusBadgeComponent } from '@app/shared/components';

/**
 * Item List Component
 * Displays items with category filtering and search capabilities
 * 
 * Requirements:
 * - 1.2: Separate list views for Raw Material and Finished Good
 * - 1.5: Filter controls to switch between categories
 * - 1.7: Search and filter capabilities by category
 */
@Component({
    selector: 'app-item-list',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        TabsModule,
        TagModule,
        ConfirmDialogModule,
        PageHeaderComponent,
        EnhancedCardComponent,
        StatusBadgeComponent,
        EnhancedTableComponent

    ],
    providers: [ConfirmationService],
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
    private store = inject(Store);
    private router = inject(Router);
    private confirmationService = inject(ConfirmationService);

    // Expose enum to template
    ItemCategory = ItemCategory;

    // Signals for reactive state
    searchQuery = signal('');
    activeTabIndex = signal(0);

    // Store selectors
    items$ = this.store.select(selectFilteredItems);
    loading$ = this.store.select(selectItemLoading);
    filters$ = this.store.select(selectItemFilters);
    rawMaterialCount$ = this.store.select(selectRawMaterialCount);
    finishedGoodCount$ = this.store.select(selectFinishedGoodCount);

    // Table columns
    columns = [
        { field: 'item_code', header: 'Item Code' },
        { field: 'item_name', header: 'Item Name' },
        { field: 'hs_code', header: 'HS Code' },
        { field: 'category', header: 'Category' },
        { field: 'unit', header: 'Unit' },
        { field: 'active', header: 'Status' }
    ];

    ngOnInit(): void {
        // Load all items on init
        this.store.dispatch(ItemActions.loadItems({}));
    }

    /**
     * Handle tab change to filter by category
     */
    onTabChange(event: any): void {
        const tabValue = parseInt(event.value || event.index || '0');
        this.activeTabIndex.set(tabValue);

        let category: ItemCategory | undefined;
        if (tabValue === 1) {
            category = ItemCategory.RAW_MATERIAL;
        } else if (tabValue === 2) {
            category = ItemCategory.FINISHED_GOOD;
        }

        this.store.dispatch(ItemActions.setFilters({
            filters: {
                category,
                searchQuery: this.searchQuery() || undefined
            }
        }));
    }

    /**
     * Handle search input
     */
    onSearch(event: Event): void {
        const query = (event.target as HTMLInputElement).value;
        this.searchQuery.set(query);

        let category: ItemCategory | undefined;
        const tabIndex = this.activeTabIndex();
        if (tabIndex === 1) {
            category = ItemCategory.RAW_MATERIAL;
        } else if (tabIndex === 2) {
            category = ItemCategory.FINISHED_GOOD;
        }

        this.store.dispatch(ItemActions.setFilters({
            filters: {
                category,
                searchQuery: query || undefined
            }
        }));
    }

    /**
     * Navigate to create item page
     */
    onCreateItem(): void {
        this.router.navigate(['/item-master/create']);
    }

    /**
     * Navigate to edit item page
     */
    onEditItem(item: ItemEnhanced): void {
        this.router.navigate(['/item-master/edit', item.id]);
    }

    /**
     * View item details
     */
    onViewItem(item: ItemEnhanced): void {
        this.router.navigate(['/item-master/view', item.id]);
    }

    /**
     * Delete item with confirmation
     */
    onDeleteItem(item: ItemEnhanced): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete item "${item.item_name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.store.dispatch(ItemActions.deleteItem({ id: item.id }));
            }
        });
    }

    /**
     * Get category badge severity
     */
    getCategorySeverity(category: ItemCategory) {
        return category === ItemCategory.RAW_MATERIAL ? 'info' : 'success';
    }

    /**
     * Get category display label
     */
    getCategoryLabel(category: ItemCategory): string {
        return category === ItemCategory.RAW_MATERIAL ? 'Raw Material' : 'Finished Good';
    }

    /**
     * Get status badge severity
     */
    getStatusSeverity(active: boolean) {
        return active ? 'success' : 'danger';
    }

    /**
     * Get status display label
     */
    getStatusLabel(active: boolean): string {
        return active ? 'Active' : 'Inactive';
    }

    /**
     * Clear all filters
     */
    onClearFilters(): void {
        this.searchQuery.set('');
        this.activeTabIndex.set(0);
        this.store.dispatch(ItemActions.clearFilters());
    }

    /**
     * Get table title based on active tab
     */
    getTableTitle(): string {
        const tabIndex = this.activeTabIndex();
        if (tabIndex === 1) {
            return 'Raw Materials';
        } else if (tabIndex === 2) {
            return 'Finished Goods';
        }
        return 'All Items';
    }

    /**
     * Get table subtitle with item count
     */
    getTableSubtitle(): string {
        // This would need to be implemented based on your store selectors
        return 'Manage your inventory items';
    }

    /**
     * Get empty message based on active tab
     */
    getEmptyMessage(): string {
        const tabIndex = this.activeTabIndex();
        if (tabIndex === 1) {
            return 'No raw materials found. Create your first raw material item.';
        } else if (tabIndex === 2) {
            return 'No finished goods found. Create your first finished goods item.';
        }
        return 'No items found. Create your first item to get started.';
    }

    /**
     * Get category icon
     */
    getCategoryIcon(category: ItemCategory): string {
        return category === ItemCategory.RAW_MATERIAL ? 'pi pi-circle' : 'pi pi-check-circle';
    }
}
