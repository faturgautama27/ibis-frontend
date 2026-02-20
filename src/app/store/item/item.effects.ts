import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { ItemActions } from './item.actions';
import { NotificationService } from '../../core/services/notification.service';
import { ItemService } from '../../features/item-master/services/item.service';

/**
 * Item Effects
 * Handles side effects for item actions with category support
 * 
 * Requirements:
 * - 1.1: CRUD operations for items with categories
 * - 1.6: Enforce category locking after creation
 */
@Injectable()
export class ItemEffects {
    private actions$ = inject(Actions);
    private notificationService = inject(NotificationService);
    private itemService = inject(ItemService);

    /**
     * Load items effect
     * Supports filtering by category
     */
    loadItems$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemActions.loadItems),
            switchMap(({ filters }) =>
                this.itemService.getItems(filters).pipe(
                    map(({ items, totalItems }) =>
                        ItemActions.loadItemsSuccess({ items, totalItems })
                    ),
                    catchError(error =>
                        of(ItemActions.loadItemsFailure({
                            error: error.message || 'Failed to load items'
                        }))
                    )
                )
            )
        )
    );

    /**
     * Load single item effect
     */
    loadItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemActions.loadItem),
            switchMap(({ id }) =>
                this.itemService.getById(id).pipe(
                    map(item => ItemActions.loadItemSuccess({ item })),
                    catchError(error =>
                        of(ItemActions.loadItemFailure({
                            error: error.message || 'Failed to load item'
                        }))
                    )
                )
            )
        )
    );

    /**
     * Create item effect
     * Category is set during creation and locked immediately
     */
    createItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemActions.createItem),
            switchMap(({ item }) =>
                this.itemService.create(item).pipe(
                    map(createdItem => ItemActions.createItemSuccess({ item: createdItem })),
                    catchError(error =>
                        of(ItemActions.createItemFailure({
                            error: error.message || 'Failed to create item'
                        }))
                    )
                )
            )
        )
    );

    /**
     * Create item success notification
     */
    createItemSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(ItemActions.createItemSuccess),
                tap(() => this.notificationService.success('Item created successfully'))
            ),
        { dispatch: false }
    );

    /**
     * Update item effect
     * Validates that category is not being changed
     */
    updateItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemActions.updateItem),
            switchMap(({ id, item }) =>
                this.itemService.update(id, item).pipe(
                    map(updatedItem => ItemActions.updateItemSuccess({ item: updatedItem })),
                    catchError(error =>
                        of(ItemActions.updateItemFailure({
                            error: error.message || 'Failed to update item'
                        }))
                    )
                )
            )
        )
    );

    /**
     * Update item success notification
     */
    updateItemSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(ItemActions.updateItemSuccess),
                tap(() => this.notificationService.success('Item updated successfully'))
            ),
        { dispatch: false }
    );

    /**
     * Delete item effect
     */
    deleteItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemActions.deleteItem),
            switchMap(({ id }) =>
                this.itemService.delete(id).pipe(
                    map(() => ItemActions.deleteItemSuccess({ id })),
                    catchError(error =>
                        of(ItemActions.deleteItemFailure({
                            error: error.message || 'Failed to delete item'
                        }))
                    )
                )
            )
        )
    );

    /**
     * Delete item success notification
     */
    deleteItemSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(ItemActions.deleteItemSuccess),
                tap(() => this.notificationService.success('Item deleted successfully'))
            ),
        { dispatch: false }
    );

    /**
     * Error notification effect
     */
    errorNotification$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(
                    ItemActions.loadItemsFailure,
                    ItemActions.loadItemFailure,
                    ItemActions.createItemFailure,
                    ItemActions.updateItemFailure,
                    ItemActions.deleteItemFailure
                ),
                tap(({ error }) => this.notificationService.error(error))
            ),
        { dispatch: false }
    );
}
