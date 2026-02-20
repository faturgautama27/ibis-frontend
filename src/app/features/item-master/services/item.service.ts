import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
    ItemEnhanced,
    CreateItemEnhancedDto,
    UpdateItemEnhancedDto
} from '../models/item-enhanced.model';
import { ItemFilters } from '../models/item-filters.model';
import { ItemCategory } from '../models/item-category.enum';

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

    /**
     * Get all items with optional filtering
     * Supports filtering by category, search query, and other criteria
     */
    getItems(filters?: ItemFilters): Observable<{ items: ItemEnhanced[]; totalItems: number }> {
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

        return this.http.put<ItemEnhanced>(`${this.apiUrl}/${id}`, item).pipe(
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Delete item
     */
    delete(id: string): Observable<void> {
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
