import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { LucideAngularModule, Factory } from 'lucide-angular';
import { ProductionDemoService } from '../../services/production-demo.service';

@Component({
    selector: 'app-production-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        TagModule,
        LucideAngularModule
    ],
    template: `
        <div class="min-h-screen bg-gray-50">
            <!-- Enhanced Page Header -->
            <div class="bg-white border-b border-gray-200 shadow-sm relative overflow-hidden">
                <!-- Background decoration -->
                <div class="absolute inset-0 bg-gradient-to-r from-gray-50/50 via-transparent to-blue-50/30 opacity-60"></div>
                
                <div class="px-6 py-6 relative z-10">
                    <!-- Main Header Content -->
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <!-- Title Section -->
                        <div class="flex items-center gap-4">
                            <!-- Icon -->
                            <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                                <i class="pi pi-cog text-blue-600 text-xl"></i>
                            </div>

                            <!-- Title and Subtitle -->
                            <div class="flex flex-col">
                                <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
                                    Production Orders
                                </h1>
                                <p class="text-base text-gray-600 mb-0 font-medium">
                                    Manage work orders and production workflows
                                </p>
                            </div>
                        </div>

                        <!-- Actions Section -->
                        <div class="flex items-center gap-3 flex-wrap">
                            <button 
                                pButton 
                                type="button" 
                                label="Create Work Order" 
                                icon="pi pi-plus"
                                class="p-button-primary shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold"
                                (click)="onCreate()">
                            </button>
                        </div>
                    </div>

                    <!-- Stats Section -->
                    <div class="mt-6 pt-6 border-t border-gray-200">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div *ngFor="let stat of headerStats" class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 hover:from-gray-100 hover:to-gray-50 hover:shadow-md hover:scale-[1.02] transition-all duration-200 border border-gray-100">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">{{ stat.label }}</p>
                                        <p class="text-2xl font-bold text-gray-900 mb-0">{{ stat.value }}</p>
                                    </div>
                                    <div class="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:scale-110 bg-gray-100">
                                        <i [class]="stat.icon" class="text-gray-600"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="p-6">
                <!-- Enhanced Table Card -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <!-- Table Header -->
                    <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">Work Orders</h3>
                            <p class="text-sm text-gray-600 mt-1">Track and manage production work orders</p>
                        </div>
                        
                        <!-- Search -->
                        <div class="flex items-center gap-3">
                            <div class="relative">
                                <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input 
                                    type="text" 
                                    pInputText 
                                    placeholder="Search by WO number, item name..."
                                    class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    (input)="onSearch($event)" />
                            </div>
                        </div>
                    </div>

                    <!-- Table -->
                    <p-table 
                        [value]="filteredProductions" 
                        [loading]="loading"
                        [paginator]="true" 
                        [rows]="20" 
                        [rowsPerPageOptions]="[10, 20, 50]" 
                        [showCurrentPageReport]="true" 
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} work orders"
                        styleClass="enhanced-table">
                        
                        <ng-template pTemplate="header">
                            <tr>
                                <th class="text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">WO Number</th>
                                <th class="text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">Date</th>
                                <th class="text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">Output Item</th>
                                <th class="text-center font-semibold text-gray-700 uppercase tracking-wide text-xs">Planned Qty</th>
                                <th class="text-center font-semibold text-gray-700 uppercase tracking-wide text-xs">Actual Qty</th>
                                <th class="text-center font-semibold text-gray-700 uppercase tracking-wide text-xs">Status</th>
                                <th class="text-center font-semibold text-gray-700 uppercase tracking-wide text-xs">Actions</th>
                            </tr>
                        </ng-template>
                        
                        <ng-template pTemplate="body" let-prod>
                            <tr class="hover:bg-gray-50 transition-colors duration-200">
                                <td class="font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200">
                                    {{ prod.wo_number }}
                                </td>
                                <td class="text-gray-600">
                                    {{ prod.wo_date | date:'dd MMM yyyy' }}
                                </td>
                                <td class="text-gray-900 font-medium">
                                    {{ prod.output_item_name }}
                                </td>
                                <td class="text-center text-gray-700 font-medium">
                                    {{ prod.planned_quantity | number:'1.0-2' }}
                                </td>
                                <td class="text-center text-gray-700 font-medium">
                                    {{ prod.actual_quantity || '-' }}
                                </td>
                                <td class="text-center">
                                    <p-tag 
                                        [value]="prod.status"
                                        [severity]="getStatusSeverity(prod.status)"
                                        styleClass="enhanced-status-tag">
                                    </p-tag>
                                </td>
                                <td class="text-center">
                                    <div class="flex items-center justify-center gap-2">
                                        <button 
                                            pButton 
                                            type="button" 
                                            icon="pi pi-eye"
                                            class="p-button-text p-button-sm hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:scale-110" 
                                            pTooltip="View Details" 
                                            tooltipPosition="top"
                                            (click)="onView(prod)">
                                        </button>
                                        <button 
                                            pButton 
                                            type="button" 
                                            icon="pi pi-pencil"
                                            class="p-button-text p-button-sm hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-200 hover:scale-110" 
                                            pTooltip="Edit Work Order" 
                                            tooltipPosition="top"
                                            (click)="onEdit(prod)">
                                        </button>
                                        <button 
                                            pButton 
                                            type="button" 
                                            icon="pi pi-trash"
                                            class="p-button-text p-button-sm hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:scale-110" 
                                            pTooltip="Delete Work Order" 
                                            tooltipPosition="top"
                                            (click)="onDelete(prod)">
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                        
                        <ng-template pTemplate="emptymessage">
                            <tr>
                                <td colspan="7" class="text-center py-12">
                                    <div class="flex flex-col items-center gap-4">
                                        <i class="pi pi-cog text-4xl text-gray-300"></i>
                                        <div>
                                            <h4 class="text-lg font-semibold text-gray-700 mb-2">No Production Orders</h4>
                                            <p class="text-gray-500 mb-4">No work orders have been created yet. Click "Create Work Order" to get started.</p>
                                            <button 
                                                pButton 
                                                type="button" 
                                                label="Create First Work Order" 
                                                icon="pi pi-plus"
                                                class="p-button-primary hover:shadow-lg hover:scale-105 transition-all duration-200"
                                                (click)="onCreate()">
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host ::ng-deep .enhanced-table .p-datatable .p-datatable-thead > tr > th {
            background: #f9fafb;
            border-bottom: 2px solid #e5e7eb;
            padding: 1rem 1.5rem;
            font-weight: 600;
            color: #374151;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        :host ::ng-deep .enhanced-table .p-datatable .p-datatable-tbody > tr {
            border-bottom: 1px solid #f3f4f6;
            transition: all 0.15s ease;
        }

        :host ::ng-deep .enhanced-table .p-datatable .p-datatable-tbody > tr:nth-child(even) {
            background: #fafafa;
        }

        :host ::ng-deep .enhanced-table .p-datatable .p-datatable-tbody > tr:hover {
            background: #f9fafb !important;
            transform: translateX(2px);
        }

        :host ::ng-deep .enhanced-table .p-datatable .p-datatable-tbody > tr > td {
            padding: 1rem 1.5rem;
            color: #4b5563;
            font-size: 0.875rem;
            vertical-align: middle;
        }

        :host ::ng-deep .enhanced-status-tag {
            font-size: 0.75rem;
            font-weight: 500;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        :host ::ng-deep .p-paginator {
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            padding: 1rem 1.5rem;
        }

        :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page {
            border-radius: 0.375rem;
            margin: 0 0.25rem;
            min-width: 2.75rem;
            height: 2.75rem;
            transition: all 0.15s ease;
        }

        :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page:hover {
            background: #dbeafe;
            color: #1d4ed8;
        }

        :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
            background: #3b82f6;
            color: white;
        }
    `]
})
export class ProductionListComponent implements OnInit {
    private router = inject(Router);
    private productionService = inject(ProductionDemoService);

    FactoryIcon = Factory;
    productions: any[] = [];
    filteredProductions: any[] = [];
    loading = false;
    searchQuery = '';

    // Header stats for enhanced page header
    headerStats = [
        {
            label: 'Total Orders',
            value: '0',
            icon: 'pi pi-list',
            changeType: 'neutral' as const
        },
        {
            label: 'In Progress',
            value: '0',
            icon: 'pi pi-clock',
            changeType: 'neutral' as const
        },
        {
            label: 'Completed',
            value: '0',
            icon: 'pi pi-check-circle',
            changeType: 'positive' as const
        },
        {
            label: 'Planned',
            value: '0',
            icon: 'pi pi-calendar',
            changeType: 'neutral' as const
        }
    ];

    ngOnInit(): void {
        this.loadProductions();
    }

    loadProductions(): void {
        this.loading = true;
        this.productionService.getAllWorkOrders().subscribe({
            next: (data) => {
                this.productions = data;
                this.filteredProductions = [...data];
                this.updateHeaderStats();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    updateHeaderStats(): void {
        const total = this.productions.length;
        const inProgress = this.productions.filter(p => p.status === 'IN_PROGRESS').length;
        const completed = this.productions.filter(p => p.status === 'COMPLETED').length;
        const planned = this.productions.filter(p => p.status === 'PLANNED').length;

        this.headerStats = [
            {
                label: 'Total Orders',
                value: total.toString(),
                icon: 'pi pi-list',
                changeType: 'neutral' as const
            },
            {
                label: 'In Progress',
                value: inProgress.toString(),
                icon: 'pi pi-clock',
                changeType: 'neutral' as const
            },
            {
                label: 'Completed',
                value: completed.toString(),
                icon: 'pi pi-check-circle',
                changeType: 'positive' as const
            },
            {
                label: 'Planned',
                value: planned.toString(),
                icon: 'pi pi-calendar',
                changeType: 'neutral' as const
            }
        ];
    }

    onSearch(event: any): void {
        const query = event.target.value.toLowerCase();
        this.searchQuery = query;
        if (!query.trim()) {
            this.filteredProductions = [...this.productions];
        } else {
            this.filteredProductions = this.productions.filter(prod =>
                prod.wo_number.toLowerCase().includes(query) ||
                prod.output_item_name.toLowerCase().includes(query) ||
                prod.status.toLowerCase().includes(query)
            );
        }
    }

    getStatusSeverity(status: string): 'success' | 'warn' | 'info' | 'danger' {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'IN_PROGRESS':
                return 'warn';
            case 'PLANNED':
                return 'info';
            case 'CANCELLED':
                return 'danger';
            default:
                return 'info';
        }
    }

    onCreate(): void {
        this.router.navigate(['/production/new']);
    }

    onView(production: any): void {
        this.router.navigate(['/production', production.id]);
    }

    onEdit(production: any): void {
        this.router.navigate(['/production', production.id, 'edit']);
    }

    onDelete(production: any): void {
        // Implement delete logic with confirmation dialog
        console.log('Delete production:', production);
    }
}
