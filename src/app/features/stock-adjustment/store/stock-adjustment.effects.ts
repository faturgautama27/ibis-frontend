/**
 * Stock Adjustment Effects
 * 
 * Handles side effects for Stock Adjustment actions (API calls, notifications).
 * 
 * Requirements: 8.1, 8.6, 8.7, 8.8, 8.9
 */

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as StockAdjustmentActions from './stock-adjustment.actions';
import { StockAdjustmentDemoService } from '../services/stock-adjustment-demo.service';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable()
export class StockAdjustmentEffects {
    private actions$ = inject(Actions);
    private stockAdjustmentService = inject(StockAdjustmentDemoService);
    private notificationService = inject(NotificationService);
    private router = inject(Router);

    // Load Adjustments
    loadAdjustments$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StockAdjustmentActions.loadAdjustments),
            switchMap(({ filters }) =>
                this.stockAdjustmentService.getAll().pipe(
                    map(adjustments => StockAdjustmentActions.loadAdjustmentsSuccess({
                        adjustments: adjustments,
                        totalRecords: adjustments.length
                    })),
                    catchError(error =>
                        of(StockAdjustmentActions.loadAdjustmentsFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    // Load Adjustment By ID
    loadAdjustmentById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StockAdjustmentActions.loadAdjustmentById),
            switchMap(({ id }) =>
                this.stockAdjustmentService.getById(id).pipe(
                    map(adjustment => {
                        if (!adjustment) {
                            throw new Error('Adjustment not found');
                        }
                        return StockAdjustmentActions.loadAdjustmentByIdSuccess({ adjustment });
                    }),
                    catchError(error =>
                        of(StockAdjustmentActions.loadAdjustmentByIdFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    // Load Adjustment Details
    loadAdjustmentDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StockAdjustmentActions.loadAdjustmentDetails),
            switchMap(({ adjustmentId }) =>
                this.stockAdjustmentService.getAdjustmentDetails(adjustmentId).pipe(
                    map(details => StockAdjustmentActions.loadAdjustmentDetailsSuccess({
                        adjustmentId,
                        details
                    })),
                    catchError(error =>
                        of(StockAdjustmentActions.loadAdjustmentDetailsFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    // Create Adjustment
    createAdjustment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StockAdjustmentActions.createAdjustment),
            exhaustMap(({ adjustment }) =>
                this.stockAdjustmentService.createAdjustment(adjustment).pipe(
                    map(createdAdjustment => {
                        this.notificationService.success('Stock adjustment created successfully');
                        return StockAdjustmentActions.createAdjustmentSuccess({ adjustment: createdAdjustment });
                    }),
                    catchError(error => {
                        this.notificationService.error('Failed to create stock adjustment');
                        return of(StockAdjustmentActions.createAdjustmentFailure({ error: error.message }));
                    })
                )
            )
        )
    );

    // Navigate after create success
    createAdjustmentSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StockAdjustmentActions.createAdjustmentSuccess),
            tap(({ adjustment }) => {
                this.router.navigate(['/stock-adjustments', adjustment.id]);
            })
        ),
        { dispatch: false }
    );

    // Update Adjustment
    updateAdjustment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StockAdjustmentActions.updateAdjustment),
            exhaustMap(({ id, adjustment }) =>
                this.stockAdjustmentService.updateAdjustment(id, adjustment).pipe(
                    map(updatedAdjustment => {
                        this.notificationService.success('Stock adjustment updated successfully');
                        return StockAdjustmentActions.updateAdjustmentSuccess({ adjustment: updatedAdjustment });
                    }),
                    catchError(error => {
                        this.notificationService.error('Failed to update stock adjustment');
                        return of(StockAdjustmentActions.updateAdjustmentFailure({ error: error.message }));
                    })
                )
            )
        )
    );

    // Approve Adjustment
    approveAdjustment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StockAdjustmentActions.approveAdjustment),
            exhaustMap(({ id, review }) =>
                this.stockAdjustmentService.approveAdjustment(id, review).pipe(
                    map(approvedAdjustment => {
                        this.notificationService.success('Stock adjustment approved successfully');
                        return StockAdjustmentActions.approveAdjustmentSuccess({ adjustment: approvedAdjustment });
                    }),
                    catchError(error => {
                        this.notificationService.error('Failed to approve stock adjustment');
                        return of(StockAdjustmentActions.approveAdjustmentFailure({ error: error.message }));
                    })
                )
            )
        )
    );

    // Reject Adjustment
    rejectAdjustment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StockAdjustmentActions.rejectAdjustment),
            exhaustMap(({ id, review }) =>
                this.stockAdjustmentService.rejectAdjustment(id, review).pipe(
                    map(rejectedAdjustment => {
                        this.notificationService.success('Stock adjustment rejected');
                        return StockAdjustmentActions.rejectAdjustmentSuccess({ adjustment: rejectedAdjustment });
                    }),
                    catchError(error => {
                        this.notificationService.error('Failed to reject stock adjustment');
                        return of(StockAdjustmentActions.rejectAdjustmentFailure({ error: error.message }));
                    })
                )
            )
        )
    );

    // Load Audit Trail
    loadAuditTrail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StockAdjustmentActions.loadAuditTrail),
            switchMap(({ adjustmentId }) =>
                this.stockAdjustmentService.getAuditTrail(adjustmentId).pipe(
                    map(auditTrail => StockAdjustmentActions.loadAuditTrailSuccess({
                        adjustmentId,
                        auditTrail
                    })),
                    catchError(error =>
                        of(StockAdjustmentActions.loadAuditTrailFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    // Load Pending Approvals
    loadPendingApprovals$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StockAdjustmentActions.loadPendingApprovals),
            switchMap(() =>
                this.stockAdjustmentService.getPendingApprovals().pipe(
                    map(pendingApprovals => StockAdjustmentActions.loadPendingApprovalsSuccess({
                        pendingApprovals
                    })),
                    catchError(error =>
                        of(StockAdjustmentActions.loadPendingApprovalsFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    // Reload pending approvals after approval/rejection
    reloadPendingApprovals$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                StockAdjustmentActions.approveAdjustmentSuccess,
                StockAdjustmentActions.rejectAdjustmentSuccess
            ),
            map(() => StockAdjustmentActions.loadPendingApprovals())
        )
    );
}
