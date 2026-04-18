import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
    StockAdjustmentHeader,
    StockAdjustmentDetail,
    AdjustmentStatus,
    ReviewStockAdjustmentDto,
    getAdjustmentStatusLabel,
    getAdjustmentStatusSeverity,
    getAdjustmentTypeLabel
} from '../../models/stock-adjustment.model';
import {
    loadAdjustmentById,
    loadAdjustmentDetails,
    loadPendingApprovals,
    approveAdjustment,
    rejectAdjustment
} from '../../store/stock-adjustment.actions';
import {
    selectSelectedAdjustment,
    selectAdjustmentDetailsById,
    selectPendingApprovals,
    selectLoading,
    selectSaving
} from '../../store/stock-adjustment.selectors';
import { PermissionService } from '../../../../shared/services/permission.service';
import { Permission, getPermissionErrorMessage } from '../../../../shared/constants/permissions';

/**
 * Stock Adjustment Approval Component
 * Handles approval/rejection of pending stock adjustments
 * 
 * Requirements: 8.8, 8.9, 14.1, 14.2, 14.3
 * - Implement pending adjustments queue
 * - Add approval/rejection actions
 * - Add comment input for approval decision
 * - Implement batch approval capability
 * - Add permission checks
 */
@Component({
    selector: 'app-stock-adjustment-approval',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        CardModule,
        TagModule,
        CheckboxModule,
        DividerModule,
        ConfirmDialogModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './stock-adjustment-approval.component.html',
    styleUrls: ['./stock-adjustment-approval.component.scss']
})
export class StockAdjustmentApprovalComponent implements OnInit {
    private store = inject(Store);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private fb = inject(FormBuilder);
    private confirmationService = inject(ConfirmationService);
    private permissionService = inject(PermissionService);
    private messageService = inject(MessageService);

    // Form for review comments
    reviewForm!: FormGroup;

    // Current adjustment being reviewed
    adjustmentId: string | null = null;
    adjustment$ = this.store.select(selectSelectedAdjustment);
    details$ = this.store.select(selectAdjustmentDetailsById(this.adjustmentId || ''));

    // Pending approvals queue
    pendingApprovals$ = this.store.select(selectPendingApprovals);

    // Loading states
    loading$ = this.store.select(selectLoading);
    saving$ = this.store.select(selectSaving);

    // Batch approval
    selectedAdjustments: StockAdjustmentHeader[] = [];
    batchMode = false;
    allPendingAdjustments: StockAdjustmentHeader[] = [];

    // Permission flags from permission service
    canApprove = false;
    canReject = false;

    ngOnInit(): void {
        // Check permissions first
        this.canApprove = this.permissionService.canApproveStockAdjustments();
        this.canReject = this.permissionService.canRejectStockAdjustments();

        // If user doesn't have any approval permissions, redirect
        if (!this.canApprove && !this.canReject) {
            this.messageService.add({
                severity: 'error',
                summary: 'Access Denied',
                detail: getPermissionErrorMessage(Permission.STOCK_ADJUSTMENT_APPROVE),
                life: 5000
            });
            this.router.navigate(['/stock-adjustment']);
            return;
        }

        // Initialize review form
        this.reviewForm = this.fb.group({
            comments: ['', [Validators.maxLength(500)]]
        });

        // Check if viewing specific adjustment or queue
        this.route.paramMap.subscribe(params => {
            this.adjustmentId = params.get('id');

            if (this.adjustmentId) {
                // Load specific adjustment for approval
                this.store.dispatch(loadAdjustmentById({ id: this.adjustmentId }));
                this.store.dispatch(loadAdjustmentDetails({ adjustmentId: this.adjustmentId }));
                this.details$ = this.store.select(selectAdjustmentDetailsById(this.adjustmentId));
            } else {
                // Load pending approvals queue
                this.store.dispatch(loadPendingApprovals());
                this.batchMode = true;
            }
        });

        // Subscribe to pending approvals for batch operations
        this.pendingApprovals$.subscribe(approvals => {
            this.allPendingAdjustments = approvals || [];
        });
    }

    /**
     * Handle select all checkbox change
     */
    onSelectAllChange(checked: boolean): void {
        this.selectedAdjustments = checked ? [...this.allPendingAdjustments] : [];
    }

    /**
     * Handle individual checkbox change
     */
    onCheckboxChange(adjustment: StockAdjustmentHeader, checked: boolean): void {
        if (checked) {
            if (!this.selectedAdjustments.find(a => a.id === adjustment.id)) {
                this.selectedAdjustments.push(adjustment);
            }
        } else {
            this.selectedAdjustments = this.selectedAdjustments.filter(a => a.id !== adjustment.id);
        }
    }

    /**
     * Check if adjustment is selected
     */
    isSelected(adjustment: StockAdjustmentHeader): boolean {
        return this.selectedAdjustments.some(a => a.id === adjustment.id);
    }

    /**
     * Approve single adjustment
     * Requirements: 14.2, 14.3
     */
    onApprove(adjustment: StockAdjustmentHeader): void {
        // Check permission before allowing approval
        if (!this.canApprove) {
            this.messageService.add({
                severity: 'error',
                summary: 'Permission Denied',
                detail: getPermissionErrorMessage(Permission.STOCK_ADJUSTMENT_APPROVE),
                life: 5000
            });
            return;
        }

        this.confirmationService.confirm({
            message: `Are you sure you want to approve adjustment "${adjustment.adjustmentNumber}"? This will update the inventory quantities.`,
            header: 'Confirm Approval',
            icon: 'pi pi-check-circle',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                const review: ReviewStockAdjustmentDto = {
                    comments: this.reviewForm.get('comments')?.value || undefined
                };
                this.store.dispatch(approveAdjustment({ id: adjustment.id, review }));

                // Reset form and navigate if single mode
                this.reviewForm.reset();
                if (!this.batchMode) {
                    setTimeout(() => this.router.navigate(['/stock-adjustment']), 1000);
                }
            }
        });
    }

    /**
     * Reject single adjustment
     * Requirements: 14.2, 14.3
     */
    onReject(adjustment: StockAdjustmentHeader): void {
        // Check permission before allowing rejection
        if (!this.canReject) {
            this.messageService.add({
                severity: 'error',
                summary: 'Permission Denied',
                detail: getPermissionErrorMessage(Permission.STOCK_ADJUSTMENT_REJECT),
                life: 5000
            });
            return;
        }

        const comments = this.reviewForm.get('comments')?.value;

        if (!comments || comments.trim() === '') {
            this.confirmationService.confirm({
                message: 'Rejection requires a comment. Please provide a reason for rejection.',
                header: 'Comment Required',
                icon: 'pi pi-exclamation-triangle',
                rejectVisible: false,
                acceptLabel: 'OK'
            });
            return;
        }

        this.confirmationService.confirm({
            message: `Are you sure you want to reject adjustment "${adjustment.adjustmentNumber}"? This action cannot be undone.`,
            header: 'Confirm Rejection',
            icon: 'pi pi-times-circle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                const review: ReviewStockAdjustmentDto = {
                    comments: comments
                };
                this.store.dispatch(rejectAdjustment({ id: adjustment.id, review }));

                // Reset form and navigate if single mode
                this.reviewForm.reset();
                if (!this.batchMode) {
                    setTimeout(() => this.router.navigate(['/stock-adjustment']), 1000);
                }
            }
        });
    }

    /**
     * Batch approve selected adjustments
     * Requirements: 14.2, 14.3
     */
    onBatchApprove(): void {
        // Check permission before allowing batch approval
        if (!this.canApprove) {
            this.messageService.add({
                severity: 'error',
                summary: 'Permission Denied',
                detail: getPermissionErrorMessage(Permission.STOCK_ADJUSTMENT_APPROVE),
                life: 5000
            });
            return;
        }

        if (this.selectedAdjustments.length === 0) {
            return;
        }

        this.confirmationService.confirm({
            message: `Are you sure you want to approve ${this.selectedAdjustments.length} adjustment(s)? This will update the inventory quantities.`,
            header: 'Confirm Batch Approval',
            icon: 'pi pi-check-circle',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                const review: ReviewStockAdjustmentDto = {
                    comments: this.reviewForm.get('comments')?.value || undefined
                };

                // Dispatch approve action for each selected adjustment
                this.selectedAdjustments.forEach(adjustment => {
                    this.store.dispatch(approveAdjustment({ id: adjustment.id, review }));
                });

                // Reset selection and form
                this.selectedAdjustments = [];
                this.reviewForm.reset();
            }
        });
    }

    /**
     * Navigate to view adjustment details
     */
    onViewDetails(adjustment: StockAdjustmentHeader): void {
        this.router.navigate(['/stock-adjustment/view', adjustment.id]);
    }

    /**
     * Navigate back to list
     */
    onCancel(): void {
        this.router.navigate(['/stock-adjustment']);
    }

    /**
     * Get status badge label
     */
    getStatusLabel(status: AdjustmentStatus): string {
        return getAdjustmentStatusLabel(status);
    }

    /**
     * Get status badge severity
     */
    getStatusSeverity(status: AdjustmentStatus): 'success' | 'warn' | 'danger' {
        const severity = getAdjustmentStatusSeverity(status);
        return severity === 'warning' ? 'warn' : severity;
    }

    /**
     * Get adjustment type label
     */
    getTypeLabel(type: string): string {
        return getAdjustmentTypeLabel(type as any);
    }

    /**
     * Format date
     */
    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Format datetime
     */
    formatDateTime(date: Date): string {
        return new Date(date).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Calculate total quantity change
     */
    getTotalQuantityChange(details: StockAdjustmentDetail[]): number {
        return details.reduce((sum, detail) => {
            const change = detail.adjustmentType === 'INCREASE' ? detail.quantity : -detail.quantity;
            return sum + change;
        }, 0);
    }
}
