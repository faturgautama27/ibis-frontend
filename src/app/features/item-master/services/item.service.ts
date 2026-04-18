import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
    ItemEnhanced,
    CreateItemEnhancedDto,
    UpdateItemEnhancedDto
} from '../models/item-enhanced.model';
import { ItemFilters } from '../models/item-filters.model';
import { ItemCategory } from '../models/item-category.enum';
import { ItemType, FacilityStatus } from '../../inventory/models/item.model';

/**
 * Item Service
 * Handles CRUD operations for items with category validation
 * 
 * Requirements:
 * - 1.1: CRUD operations for items with categories
 * - 1.6: Prevent category changes after creation
 * - 1.7: Search and filter capabilities by category
 */
@Injectable({
    providedIn: 'root'
})
export class ItemService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/items`;

    // Development mode toggle - set to false to use real API
    private readonly USE_MOCK_DATA = true;

    // Mock data for development
    private readonly MOCK_ITEMS: ItemEnhanced[] = [
        // Raw Materials
        {
            id: 'item-001',
            item_code: 'RM-001',
            item_name: 'Steel Rod 10mm',
            hs_code: '7213.10.00',
            item_type: ItemType.RAW,
            unit: 'KG',
            is_hazardous: false,
            facility_status: FacilityStatus.NON,
            active: true,
            created_at: new Date('2024-01-01'),
            updated_at: new Date('2024-01-01'),
            category: ItemCategory.RAW_MATERIAL,
            categoryLocked: true,
            categoryLockedAt: new Date('2024-01-01'),
            categoryLockedBy: 'system',
            description: 'High quality steel rod for construction',
            price: 15000,
            currency: 'IDR',
            min_stock: 100,
            max_stock: 1000,
            reorder_point: 200
        },
        {
            id: 'item-002',
            item_code: 'RM-002',
            item_name: 'Aluminum Sheet 2mm',
            hs_code: '7606.11.00',
            item_type: ItemType.RAW,
            unit: 'M2',
            is_hazardous: false,
            facility_status: FacilityStatus.NON,
            active: true,
            created_at: new Date('2024-01-01'),
            updated_at: new Date('2024-01-01'),
            category: ItemCategory.RAW_MATERIAL,
            categoryLocked: true,
            categoryLockedAt: new Date('2024-01-01'),
            categoryLockedBy: 'system',
            description: 'Premium aluminum sheet for manufacturing',
            price: 85000,
            currency: 'IDR',
            min_stock: 50,
            max_stock: 500,
            reorder_point: 100
        },
        {
            id: 'item-003',
            item_code: 'RM-003',
            item_name: 'Plastic Granules PP',
            hs_code: '3902.10.00',
            item_type: ItemType.RAW,
            unit: 'KG',
            is_hazardous: false,
            facility_status: FacilityStatus.NON,
            active: true,
            created_at: new Date('2024-01-01'),
            updated_at: new Date('2024-01-01'),
            category: ItemCategory.RAW_MATERIAL,
            categoryLocked: true,
            categoryLockedAt: new Date('2024-01-01'),
            categoryLockedBy: 'system',
            description: 'Polypropylene granules for injection molding',
            price: 22000,
            currency: 'IDR',
            min_stock: 200,
            max_stock: 2000,
            reorder_point: 400
        },
        {
            id: 'item-004',
            item_code: 'RM-004',
            item_name: 'Chemical Solvent X',
            hs_code: '2905.11.00',
            item_type: ItemType.RAW,
            unit: 'LTR',
            is_hazardous: true,
            facility_status: FacilityStatus.FASILITAS,
            active: true,
            created_at: new Date('2024-01-01'),
            updated_at: new Date('2024-01-01'),
            category: ItemCategory.RAW_MATERIAL,
            categoryLocked: true,
            categoryLockedAt: new Date('2024-01-01'),
            categoryLockedBy: 'system',
            description: 'Industrial grade chemical solvent',
            price: 45000,
            currency: 'IDR',
            min_stock: 20,
            max_stock: 200,
            reorder_point: 50
        },
        // Finished Goods
        {
            id: 'item-005',
            item_code: 'FG-001',
            item_name: 'Steel Frame Assembly',
            hs_code: '7308.90.00',
            item_type: ItemType.FG,
            unit: 'PCS',
            is_hazardous: false,
            facility_status: FacilityStatus.NON,
            active: true,
            created_at: new Date('2024-01-01'),
            updated_at: new Date('2024-01-01'),
            category: ItemCategory.FINISHED_GOOD,
            categoryLocked: true,
            categoryLockedAt: new Date('2024-01-01'),
            categoryLockedBy: 'system',
            description: 'Complete steel frame assembly for construction',
            price: 250000,
            currency: 'IDR',
            min_stock: 10,
            max_stock: 100,
            reorder_point: 20
        },
        {
            id: 'item-006',
            item_code: 'FG-002',
            item_name: 'Aluminum Window Frame',
            hs_code: '7610.10.00',
            item_type: ItemType.FG,
            unit: 'PCS',
            is_hazardous: false,
            facility_status: FacilityStatus.NON,
            active: true,
            created_at: new Date('2024-01-01'),
            updated_at: new Date('2024-01-01'),
            category: ItemCategory.FINISHED_GOOD,
            categoryLocked: true,
            categoryLockedAt: new Date('2024-01-01'),
            categoryLockedBy: 'system',
            description: 'Premium aluminum window frame',
            price: 180000,
            currency: 'IDR',
            min_stock: 15,
            max_stock: 150,
            reorder_point: 30
        },
        {
            id: 'item-007',
            item_code: 'FG-003',
            item_name: 'Plastic Container 5L',
            hs_code: '3923.30.00',
            item_type: ItemType.FG,
            unit: 'PCS',
            is_hazardous: false,
            facility_status: FacilityStatus.NON,
            active: true,
            created_at: new Date('2024-01-01'),
            updated_at: new Date('2024-01-01'),
            category: ItemCategory.FINISHED_GOOD,
            categoryLocked: true,
            categoryLockedAt: new Date('2024-01-01'),
            categoryLockedBy: 'system',
            description: 'Food grade plastic container 5 liter',
            price: 35000,
            currency: 'IDR',
            min_stock: 50,
            max_stock: 500,
            reorder_point: 100
        },
        {
            id: 'item-008',
            item_code: 'FG-004',
            item_name: 'Electronic Component Board',
            hs_code: '8534.00.00',
            item_type: ItemType.FG,
            unit: 'PCS',
            is_hazardous: false,
            facility_status: FacilityStatus.NON,
            active: true,
            created_at: new Date('2024-01-01'),
            updated_at: new Date('2024-01-01'),
            category: ItemCategory.FINISHED_GOOD,
            categoryLocked: true,
            categoryLockedAt: new Date('2024-01-01'),
            categoryLockedBy: 'system',
            description: 'Advanced electronic component board',
            price: 125000,
            currency: 'IDR',
            min_stock: 25,
            max_stock: 250,
            reorder_point: 50
        }
    ];

    /**
     * Get all items with optional filtering
     * Supports filtering by category, search query, and other criteria
     */
    getItems(filters?: ItemFilters): Observable<{ items: ItemEnhanced[]; totalItems: number }> {
        if (this.USE_MOCK_DATA) {
            return this.getMockItems(filters);
        }

        let params = new HttpParams();

        if (filters) {
            if (filters.category) {
                params = params.set('category', filters.category);
            }
            if (filters.searchQuery) {
                params = params.set('search', filters.searchQuery);
            }
            if (filters.active !== undefined) {
                params = params.set('active', filters.active.toString());
            }
            if (filters.warehouseId) {
                params = params.set('warehouseId', filters.warehouseId);
            }
            if (filters.isHazardous !== undefined) {
                params = params.set('isHazardous', filters.isHazardous.toString());
            }
        }

        return this.http.get<{ items: ItemEnhanced[]; totalItems: number }>(
            this.apiUrl,
            { params }
        ).pipe(
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Get mock items with filtering (for development)
     */
    private getMockItems(filters?: ItemFilters): Observable<{ items: ItemEnhanced[]; totalItems: number }> {
        let filteredItems = [...this.MOCK_ITEMS];

        // Apply filters
        if (filters) {
            if (filters.category) {
                filteredItems = filteredItems.filter(item => item.category === filters.category);
            }
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                filteredItems = filteredItems.filter(item =>
                    item.item_code.toLowerCase().includes(query) ||
                    item.item_name.toLowerCase().includes(query) ||
                    item.hs_code.toLowerCase().includes(query)
                );
            }
            if (filters.active !== undefined) {
                filteredItems = filteredItems.filter(item => item.active === filters.active);
            }
            if (filters.isHazardous !== undefined) {
                filteredItems = filteredItems.filter(item => item.is_hazardous === filters.isHazardous);
            }
        }

        // Simulate API delay
        return of({
            items: filteredItems,
            totalItems: filteredItems.length
        }).pipe(delay(300));
    }

    /**
     * Get items by category
     * Convenience method for filtering by specific category
     */
    getItemsByCategory(category: ItemCategory): Observable<ItemEnhanced[]> {
        return this.getItems({ category }).pipe(
            map(response => response.items)
        );
    }

    /**
     * Get raw material items
     */
    getRawMaterials(): Observable<ItemEnhanced[]> {
        return this.getItemsByCategory(ItemCategory.RAW_MATERIAL);
    }

    /**
     * Get finished good items
     */
    getFinishedGoods(): Observable<ItemEnhanced[]> {
        return this.getItemsByCategory(ItemCategory.FINISHED_GOOD);
    }

    /**
     * Get item by ID
     */
    getById(id: string): Observable<ItemEnhanced> {
        if (this.USE_MOCK_DATA) {
            const item = this.MOCK_ITEMS.find(i => i.id === id);
            if (item) {
                return of(item).pipe(delay(200));
            } else {
                return throwError(() => new Error('Item not found'));
            }
        }

        return this.http.get<ItemEnhanced>(`${this.apiUrl}/${id}`).pipe(
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Create new item
     * Category is set during creation and locked immediately
     */
    create(item: CreateItemEnhancedDto): Observable<ItemEnhanced> {
        // Validate category is provided
        if (!item.category) {
            return throwError(() => new Error('Item category is required'));
        }

        if (this.USE_MOCK_DATA) {
            const newItem: ItemEnhanced = {
                id: `item-${Date.now()}`,
                ...item,
                created_at: new Date(),
                updated_at: new Date(),
                categoryLocked: true,
                categoryLockedAt: new Date(),
                categoryLockedBy: 'current-user'
            };
            this.MOCK_ITEMS.push(newItem);
            return of(newItem).pipe(delay(500));
        }

        return this.http.post<ItemEnhanced>(this.apiUrl, item).pipe(
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Update existing item
     * Validates that category is not being changed
     */
    update(id: string, item: UpdateItemEnhancedDto): Observable<ItemEnhanced> {
        // Validate that category is not in the update payload
        if ('category' in item) {
            return throwError(() => new Error(
                'Cannot change item category after creation. Category is immutable.'
            ));
        }

        if (this.USE_MOCK_DATA) {
            const existingItemIndex = this.MOCK_ITEMS.findIndex(i => i.id === id);
            if (existingItemIndex === -1) {
                return throwError(() => new Error('Item not found'));
            }

            const updatedItem = {
                ...this.MOCK_ITEMS[existingItemIndex],
                ...item,
                updated_at: new Date()
            };
            this.MOCK_ITEMS[existingItemIndex] = updatedItem;
            return of(updatedItem).pipe(delay(500));
        }

        return this.http.put<ItemEnhanced>(`${this.apiUrl}/${id}`, item).pipe(
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Delete item
     */
    delete(id: string): Observable<void> {
        if (this.USE_MOCK_DATA) {
            const itemIndex = this.MOCK_ITEMS.findIndex(i => i.id === id);
            if (itemIndex === -1) {
                return throwError(() => new Error('Item not found'));
            }
            this.MOCK_ITEMS.splice(itemIndex, 1);
            return of(void 0).pipe(delay(300));
        }

        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Validate item category
     * Checks if an item's category matches the expected category
     */
    validateItemCategory(item: ItemEnhanced, expectedCategory: ItemCategory): boolean {
        return item.category === expectedCategory;
    }

    /**
     * Validate multiple items have the same category
     */
    validateItemsCategory(items: ItemEnhanced[], expectedCategory: ItemCategory): {
        valid: boolean;
        invalidItems: ItemEnhanced[];
    } {
        const invalidItems = items.filter(item => item.category !== expectedCategory);
        return {
            valid: invalidItems.length === 0,
            invalidItems
        };
    }

    /**
     * Search items by code or name
     */
    searchItems(query: string): Observable<ItemEnhanced[]> {
        return this.getItems({ searchQuery: query }).pipe(
            map(response => response.items)
        );
    }

    /**
     * Handle HTTP errors
     */
    private handleError(error: any): Observable<never> {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = error.error.message;
        } else if (error.error?.message) {
            // Server-side error with message
            errorMessage = error.error.message;
        } else if (error.status) {
            // HTTP error
            switch (error.status) {
                case 400:
                    errorMessage = 'Invalid request. Please check your input.';
                    break;
                case 404:
                    errorMessage = 'Item not found.';
                    break;
                case 409:
                    errorMessage = 'Item already exists or conflict occurred.';
                    break;
                case 500:
                    errorMessage = 'Server error. Please try again later.';
                    break;
                default:
                    errorMessage = `Error: ${error.statusText}`;
            }
        }

        return throwError(() => new Error(errorMessage));
    }
}
