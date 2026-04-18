/**
 * Sales Order Effects
 * 
 * Handles side effects for Sales Order actions, including API calls.
 */

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, switchMap } from 'rxjs/operators';
import { SalesOrderDemoService } from '../services/sales-order-demo.service';
import { NotificationService } from '../../../core/services/notification.service';
import * as SalesOrderActions from './sales-order.actions';

/**
 * Sales Order Effects
 * Manages asynchronous operations for the Sales Order feature
 */
@Injectable()
export class SalesOrderEffects {
    private actions$ = inject(Actions);
    private salesOrderService = inject(SalesOrderDemoService);
    private notificationService = inject(NotificationService);

    /**
     * Load Orders Effect
     * Fetches sales orders from the API based on filters
     */
    loadOrders$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SalesOrderActions.loadOrders),
            switchMap(({ filters }) =>
                this.salesOrderService.getAll().pipe(
                    map(orders => SalesOrderActions.loadOrdersSuccess({
                        orders,
                        totalRecords: orders.length
                    })),
                    catchError(error => of(SalesOrderActions.loadOrdersFailure({
                        error: error.message || 'Failed to load sales orders'
                    })))
                )
            )
        )
    );

    /**
     * Load Order Details Effect
     * Fetches line items for a specific sales order
     */
    loadOrderDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SalesOrderActions.loadOrderDetails),
            switchMap(({ orderId }) =>
                this.salesOrderService.getOrderDetails(orderId).pipe(
                    map(details => SalesOrderActions.loadOrderDetailsSuccess({
                        orderId,
                        details
                    })),
                    catchError(error => of(SalesOrderActions.loadOrderDetailsFailure({
                        error: error.message || 'Failed to load order details'
                    })))
                )
            )
        )
    );

    /**
     * Create Order Effect
     * Creates a new sales order with details
     */
    createOrder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SalesOrderActions.createOrder),
            exhaustMap(({ order, details }) =>
                this.salesOrderService.createOrder({
                    ...order,
                    details: details.map((d, index) => ({
                        ...d,
                        lineNumber: index + 1
                    }))
                } as any).pipe(
                    map(createdOrder => {
                        this.notificationService.success('Sales order created successfully');
                        return SalesOrderActions.createOrderSuccess({ order: createdOrder });
                    }),
                    catchError(error => {
                        this.notificationService.error(error.message || 'Failed to create sales order');
                        return of(SalesOrderActions.createOrderFailure({
                            error: error.message || 'Failed to create sales order'
                        }));
                    })
                )
            )
        )
    );

    /**
     * Update Order Effect
     * Updates an existing sales order
     */
    updateOrder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SalesOrderActions.updateOrder),
            exhaustMap(({ orderId, order, details }) =>
                this.salesOrderService.updateOrder(orderId, {
                    ...order,
                    details: details?.map((d, index) => ({
                        ...d,
                        lineNumber: index + 1
                    }))
                } as any).pipe(
                    map(updatedOrder => {
                        this.notificationService.success('Sales order updated successfully');
                        return SalesOrderActions.updateOrderSuccess({ order: updatedOrder });
                    }),
                    catchError(error => {
                        this.notificationService.error(error.message || 'Failed to update sales order');
                        return of(SalesOrderActions.updateOrderFailure({
                            error: error.message || 'Failed to update sales order'
                        }));
                    })
                )
            )
        )
    );

    /**
     * Delete Order Effect
     * Deletes a sales order
     */
    deleteOrder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SalesOrderActions.deleteOrder),
            exhaustMap(({ orderId }) =>
                this.salesOrderService.deleteOrder(orderId).pipe(
                    map(() => {
                        this.notificationService.success('Sales order deleted successfully');
                        return SalesOrderActions.deleteOrderSuccess({ orderId });
                    }),
                    catchError(error => {
                        this.notificationService.error(error.message || 'Failed to delete sales order');
                        return of(SalesOrderActions.deleteOrderFailure({
                            error: error.message || 'Failed to delete sales order'
                        }));
                    })
                )
            )
        )
    );

    /**
     * Update Order Status Effect
     * Updates the status of a sales order
     */
    updateOrderStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SalesOrderActions.updateOrderStatus),
            exhaustMap(({ orderId, status }) =>
                this.salesOrderService.updateStatus(orderId, status).pipe(
                    map(updatedOrder => {
                        this.notificationService.success('Sales order status updated successfully');
                        return SalesOrderActions.updateOrderStatusSuccess({ order: updatedOrder });
                    }),
                    catchError(error => {
                        this.notificationService.error(error.message || 'Failed to update order status');
                        return of(SalesOrderActions.updateOrderStatusFailure({
                            error: error.message || 'Failed to update order status'
                        }));
                    })
                )
            )
        )
    );
}
