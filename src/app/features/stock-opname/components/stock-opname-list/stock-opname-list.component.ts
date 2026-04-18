import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LucideAngularModule, ClipboardList } from 'lucide-angular';
import { StockOpname, OpnameType } from '../../models/stock-opname.model';
import { StockOpnameService } from '../../services/stock-opname.service';
import { MOCK_STOCK_OPNAMES } from './stock-opname-list.mock';

@Component({
    selector: 'app-stock-opname-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        TagModule,
        TooltipModule,
        ToastModule,
        ConfirmDialogModule,
        SelectModule,
        DatePickerModule,
        LucideAngularModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="main-layout">
            <!-- Page Header -->
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                    <lucide-icon [img]="ClipboardListIcon" class="w-8 h-8 text-sky-600"></lucide-icon>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Stock Opname Sessions</h1>
                        <p class="text-sm text-gray-600 mt-1">Manage stock counting and adjustments</p>
                    </div>
                </div>
                <button pButton type="button" label="Create Opname" icon="pi pi-plus" class="p-button-primary" (click)="onCreate()"></button>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input type="text" pInputText placeholder="Search opname number, warehouse..." 
                               [(ngModel)]="searchQuery" (input)="onSearch($event)" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <p-select [(ngModel)]="selectedStatus" [options]="statusOptions" 
                                 optionLabel="label" optionValue="value" placeholder="Select Status" 
                                 (onChange)="onStatusChange($event.value)" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <p-select [(ngModel)]="selectedType" [options]="typeOptions" 
                                 optionLabel="label" optionValue="value" placeholder="Select Type" 
                                 (onChange)="onTypeChange($event.value)" class="w-full" />
                    </div>
                    <div class="flex items-end">
                        <button pButton type="button" label="Clear Filters" icon="pi pi-filter-slash"
                                class="p-button-outlined p-button-sm" (click)="onClearFilters()"></button>
                    </div>
                </div>
            </div>

            <!-- Data Table -->
            <div class="bg-white rounded-lg shadow-sm p-6" style="max-height: calc(100vh - 20rem); overflow-y: auto">
                <p-table [value]="(opnames$ | async) || []" [paginator]="true" [rows]="20" 
                         [loading]="(loading$ | async) || false" [rowsPerPageOptions]="[10, 20, 50]" 
                         [showCurrentPageReport]="true" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} opname sessions">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Opname Number</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Warehouse</th>
                            <th>Status</th>
                            <th>Created By</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-opname>
                        <tr>
                            <td class="font-medium text-gray-900">{{ opname.opname_number }}</td>
                            <td>{{ formatDate(opname.opname_date) }}</td>
                            <td>{{ getTypeLabel(opname.opname_type) }}</td>
                            <td>{{ opname.warehouse_name }}</td>
                            <td><p-tag [value]="getStatusLabel(opname.status)" [severity]="getStatusSeverity(opname.status)"></p-tag></td>
                            <td>{{ opname.created_by }}</td>
                            <td class="text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <button pButton type="button" icon="pi pi-eye" class="p-button-text p-button-sm" 
                                            pTooltip="View" (click)="onView(opname)"></button>
                                    <button pButton type="button" icon="pi pi-pencil" class="p-button-text p-button-sm" 
                                            pTooltip="Edit" (click)="onEdit(opname)" [disabled]="opname.status === 'COMPLETED'"></button>
                                    <button pButton type="button" icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" 
                                            pTooltip="Delete" (click)="onDelete(opname)" [disabled]="opname.status === 'COMPLETED'"></button>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="7" class="text-center py-8">
                                <div class="flex flex-col items-center gap-2">
                                    <i class="pi pi-inbox text-4xl text-gray-400"></i>
                                    <p class="text-gray-500">No stock opname sessions found</p>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>

        <!-- Confirmation Dialog -->
        <p-confirmDialog></p-confirmDialog>
        
        <!-- Toast Notifications -->
        <p-toast></p-toast>
    `
})
export class StockOpnameListComponent implements OnInit {
    private router = inject(Router);
    private opnameService = inject(StockOpnameService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    // Development mode toggle
    private readonly USE_MOCK_DATA = true; // Set to false to use service

    ClipboardListIcon = ClipboardList;

    // Filter properties
    searchQuery = '';
    selectedStatus: string | null = null;
    selectedType: OpnameType | null = null;

    // Mock data properties
    private mockOpnames: StockOpname[] = MOCK_STOCK_OPNAMES;
    private filteredMockOpnames: StockOpname[] = [...this.mockOpnames];

    // Public observables
    opnames$: Observable<StockOpname[]> = of([]);
    loading$: Observable<boolean> = of(false);

    // Options for dropdowns
    statusOptions = [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Completed', value: 'COMPLETED' }
    ];

    typeOptions = [
        { label: 'Periodic', value: OpnameType.PERIODIC },
        { label: 'Spot Check', value: OpnameType.SPOT_CHECK },
        { label: 'Year End', value: OpnameType.YEAR_END }
    ];

    ngOnInit(): void {
        if (this.USE_MOCK_DATA) {
            this.initializeMockData();
        } else {
            this.loading$ = of(true);
            this.opnameService.getAllOpnames().subscribe(data => {
                this.opnames$ = of(data);
                this.loading$ = of(false);
            });
        }
    }

    private initializeMockData(): void {
        this.filteredMockOpnames = [...this.mockOpnames];
        this.opnames$ = of(this.filteredMockOpnames);
        this.loading$ = of(false);
    }

    private applyMockFilters(): void {
        let filtered = [...this.mockOpnames];

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(opname =>
                opname.opname_number.toLowerCase().includes(query) ||
                opname.warehouse_name.toLowerCase().includes(query) ||
                opname.notes?.toLowerCase().includes(query)
            );
        }

        if (this.selectedStatus) {
            filtered = filtered.filter(opname => opname.status === this.selectedStatus);
        }

        if (this.selectedType) {
            filtered = filtered.filter(opname => opname.opname_type === this.selectedType);
        }

        this.filteredMockOpnames = filtered;
        this.opnames$ = of(this.filteredMockOpnames);
    }

    onSearch(event: Event): void {
        const query = (event.target as HTMLInputElement).value;
        this.searchQuery = query;
        if (this.USE_MOCK_DATA) {
            this.applyMockFilters();
        }
    }

    onStatusChange(status: string | null): void {
        this.selectedStatus = status;
        if (this.USE_MOCK_DATA) {
            this.applyMockFilters();
        }
    }

    onTypeChange(type: OpnameType | null): void {
        this.selectedType = type;
        if (this.USE_MOCK_DATA) {
            this.applyMockFilters();
        }
    }

    onClearFilters(): void {
        this.searchQuery = '';
        this.selectedStatus = null;
        this.selectedType = null;
        if (this.USE_MOCK_DATA) {
            this.applyMockFilters();
        }
    }

    onCreate(): void {
        this.router.navigate(['/stock-opname/new']);
    }

    onView(opname: StockOpname): void {
        this.router.navigate(['/stock-opname', opname.id]);
    }

    onEdit(opname: StockOpname): void {
        this.router.navigate(['/stock-opname', opname.id, 'edit']);
    }

    onDelete(opname: StockOpname): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete Stock Opname "${opname.opname_number}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (this.USE_MOCK_DATA) {
                    const index = this.mockOpnames.findIndex(o => o.id === opname.id);
                    if (index > -1) {
                        this.mockOpnames.splice(index, 1);
                        this.applyMockFilters();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: `Stock Opname ${opname.opname_number} deleted successfully`
                        });
                    }
                } else {
                    // Call service delete method
                }
            }
        });
    }

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            'DRAFT': 'Draft',
            'APPROVED': 'Approved',
            'COMPLETED': 'Completed'
        };
        return labels[status] || status;
    }

    getStatusSeverity(status: string): 'secondary' | 'info' | 'success' {
        const severities: Record<string, 'secondary' | 'info' | 'success'> = {
            'DRAFT': 'secondary',
            'APPROVED': 'info',
            'COMPLETED': 'success'
        };
        return severities[status] || 'secondary';
    }

    getTypeLabel(type: OpnameType): string {
        const labels: Record<OpnameType, string> = {
            [OpnameType.PERIODIC]: 'Periodic',
            [OpnameType.SPOT_CHECK]: 'Spot Check',
            [OpnameType.YEAR_END]: 'Year End'
        };
        return labels[type] || type;
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}
