/**
 * Outbound Effects
 * 
 * Handles side effects for Outbound state management including SO lookup API calls.
 * Requirements: 7.1, 7.6
 */

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap } from 'rxjs/operators';
import * as OutboundActions from './outbound.actions';
import { OutboundService } from '../services/outbound.service';
import { SalesOrderService } from '../../sales-order/services/sales-order.service';

@Injectable()
export class OutboundEffects {
    constructor(
        private actions$: Actions,
        private outboundService: OutboundService,
        private salesOrderService: SalesOrderService
    ) { }

    /**
     * Load outbounds with filters
     */
    loadOutbounds$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OutboundActions.loadOutbounds),
            switchMap(({ filters }) =>
                this.outboundService.getOutbounds(filters).pipe(
                    map(outbounds => OutboundActions.loadOutboundsSuccess({
                        outbounds,
                        totalRecords: outbounds.length
                    })),
                    catchError(error => of(OutboundActions.loadOutboundsFailure({
                        error: error.message
                    })))
                )
            )
        )
    );

    /**
     * Load outbound details
     */
    loadOutboundDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OutboundActions.loadOutboundDetails),
            switchMap(({ outboundId }) =>
                this.outboundService.getOutboundDetails(outboundId).pipe(
                    map(details => OutboundActions.loadOutboundDetailsSuccess({
                        outboundId,
                        details
                    })),
                    catchError(error => of(OutboundActions.loadOutboundDetailsFailure({
                        error: error.message
                    })))
                )
            )
        )
    );

    /**
     * Create outbound
     */
    createOutbound$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OutboundActions.createOutbound),
            exhaustMap(({ outbound, details }) =>
                this.outboundService.createOutbound(outbound, details).pipe(
                    map(createdOutbound => OutboundActions.createOutboundSuccess({
                        outbound: createdOutbound
                    })),
                    catchError(error => of(OutboundActions.createOutboundFailure({
                        error: error.message
                    })))
                )
            )
        )
    );

    /**
     * Update outbound
     */
    updateOutbound$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OutboundActions.updateOutbound),
            exhaustMap(({ outboundId, outbound, details }) =>
                this.outboundService.updateOutbound(outboundId, outbound, details).pipe(
                    map(updatedOutbound => OutboundActions.updateOutboundSuccess({
                        outbound: updatedOutbound
                    })),
                    catchError(error => of(OutboundActions.updateOutboundFailure({
                        error: error.message
                    })))
                )
            )
        )
    );

    /**
     * Delete outbound
     */
    deleteOutbound$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OutboundActions.deleteOutbound),
            exhaustMap(({ outboundId }) =>
                this.outboundService.deleteOutbound(outboundId).pipe(
                    map(() => OutboundActions.deleteOutboundSuccess({ outboundId })),
                    catchError(error => of(OutboundActions.deleteOutboundFailure({
                        error: error.message
                    })))
                )
            )
        )
    );

    /**
     * Lookup sales orders for linking
     * Requirements: 7.1, 7.6
     */
    lookupSalesOrders$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OutboundActions.lookupSalesOrders),
            switchMap(({ criteria }) =>
                this.salesOrderService.lookupSalesOrders(criteria).pipe(
                    map(orders => OutboundActions.lookupSalesOrdersSuccess({ orders })),
                    catchError(error => of(OutboundActions.lookupSalesOrdersFailure({
                        error: error.message
                    })))
                )
            )
        )
    );
}
