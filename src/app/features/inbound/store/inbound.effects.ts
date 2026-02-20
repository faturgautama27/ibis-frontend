/**
 * Inbound Effects
 * 
 * Handles side effects for Inbound operations including PO lookup API calls.
 * Requirements: 4.1, 4.6
 */

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import * as InboundActions from './inbound.actions';
import { InboundService } from '../services/inbound.service';
import { PurchaseOrderService } from '../../purchase-order/services/purchase-order.service';

@Injectable()
export class InboundEffects {

    constructor(
        private actions$: Actions,
        private inboundService: InboundService,
        private purchaseOrderService: PurchaseOrderService
    ) { }

    // Load Inbounds
    loadInbounds$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InboundActions.loadInbounds),
            switchMap(({ filters }) =>
                this.inboundService.getInbounds(filters).pipe(
                    map(response => InboundActions.loadInboundsSuccess({
                        inbounds: response.data,
                        totalRecords: response.total
                    })),
                    catchError(error => of(InboundActions.loadInboundsFailure({
                        error: error.message || 'Failed to load inbounds'
                    })))
                )
            )
        )
    );

    // Load Inbound Details
    loadInboundDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InboundActions.loadInboundDetails),
            switchMap(({ inboundId }) =>
                this.inboundService.getInboundDetails(inboundId).pipe(
                    map(details => InboundActions.loadInboundDetailsSuccess({
                        inboundId,
                        details
                    })),
                    catchError(error => of(InboundActions.loadInboundDetailsFailure({
                        error: error.message || 'Failed to load inbound details'
                    })))
                )
            )
        )
    );

    // Create Inbound
    createInbound$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InboundActions.createInbound),
            switchMap(({ inbound, details }) =>
                this.inboundService.createInbound(inbound, details).pipe(
                    map(createdInbound => InboundActions.createInboundSuccess({
                        inbound: createdInbound
                    })),
                    catchError(error => of(InboundActions.createInboundFailure({
                        error: error.message || 'Failed to create inbound'
                    })))
                )
            )
        )
    );

    // Update Inbound
    updateInbound$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InboundActions.updateInbound),
            switchMap(({ inboundId, inbound, details }) =>
                this.inboundService.updateInbound(inboundId, inbound, details).pipe(
                    map(updatedInbound => InboundActions.updateInboundSuccess({
                        inbound: updatedInbound
                    })),
                    catchError(error => of(InboundActions.updateInboundFailure({
                        error: error.message || 'Failed to update inbound'
                    })))
                )
            )
        )
    );

    // Delete Inbound
    deleteInbound$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InboundActions.deleteInbound),
            switchMap(({ inboundId }) =>
                this.inboundService.deleteInbound(inboundId).pipe(
                    map(() => InboundActions.deleteInboundSuccess({ inboundId })),
                    catchError(error => of(InboundActions.deleteInboundFailure({
                        error: error.message || 'Failed to delete inbound'
                    })))
                )
            )
        )
    );

    // PO Lookup (Requirements: 4.1, 4.6)
    lookupPurchaseOrders$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InboundActions.lookupPurchaseOrders),
            switchMap(({ criteria }) =>
                this.purchaseOrderService.lookupPurchaseOrders(criteria).pipe(
                    map(orders => InboundActions.lookupPurchaseOrdersSuccess({ orders })),
                    catchError(error => of(InboundActions.lookupPurchaseOrdersFailure({
                        error: error.message || 'Failed to lookup purchase orders'
                    })))
                )
            )
        )
    );
}
