import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { LucideAngularModule, PackageOpen, Search, Filter } from 'lucide-angular';
import { OutboundDemoService } from '../../services/outbound-demo.service';

// Enhanced Components
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
    selector: 'app-outbound-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        TagModule,
        IconFieldModule,
        InputIconModule,
        LucideAngularModule,
        EnhancedCardComponent,
        PageHeaderComponent,
        StatusBadgeComponent,
        EmptyStateComponent
    ],
    template: `
        <div class="min-h-screen bg-gray-50">
            <!-- Enhanced Page Header -->
            <app-page-header
                title="Outbound Shipments"
                subtitle="Manage outbound shipments and deliveries"
                icon="pi pi-truck"
                [breadcrumbs]="breadcrumbs"
                [primaryAction]="{ label: 'Create Outbound', icon: 'pi pi-plus' }"
                (primaryActionClick)="onCreate()">
            </app-page-header>

            <!-- Main Content -->
            <div class="p-6 space-y-6">
                <!-- Search and Filter Card -->
                <app-enhanced-card variant="standard" class="search-filter-card">
                    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <!-- Search -->
                        <div class="flex-1 max-w-md">
                            <p-iconfield iconPosition="left">
                                <p-inputicon>
                                    <lucide-icon [img]="SearchIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                                </p-inputicon>
                                <input 
                                    pInputText 
                                    placeholder="Search outbound shipments..." 
                                    class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                                    (input)="onSearch($event)"
                                />
                            </p-iconfield>
                        </div>

                        <!-- Filter Actions -->
                        <div class="flex gap-3">
                            <button
                                pButton
                                type="button"
                                label="Filter"
                                icon="pi pi-filter"
                                class="p-button-outlined p-button-sm"
                                (click)="showFilters = !showFilters"
                            ></button>
                            <button
                                pButton
                                type="button"
                                label="Export"
                                icon="pi pi-download"
                                class="p-button-outlined p-button-sm"
                                (click)="onExport()"
                            ></button>
                        </div>
                    </div>

                    <!-- Expandable Filters -->
                    @if (showFilters) {
                        <div class="mt-4 pt-4 border-t border-gray-200">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select class="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                                    <input 
                                        type="date" 
                                        class="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                                    <select class="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                        <option value="">All Customers</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    }
                </app-enhanced-card>

                <!-- Data Table Card -->
                <app-enhanced-card variant="standard" [loading]="loading" class="table-card">
                    <div class="overflow-hidden">
                        <p-table 
                            [value]="outbounds" 
                            [paginator]="true" 
                            [rows]="20" 
                            [loading]="loading"
                            [rowsPerPageOptions]="[10, 20, 50]" 
                            [showCurrentPageReport]="true" 
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} outbound shipments"
                            styleClass="enhanced-table"
                            responsiveLayout="scroll"
                        >
                            <ng-template pTemplate="header">
                                <tr class="bg-gray-50">
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                                        Shipment Number
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                                        Date
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                                        Customer
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                                        Type
                                    </th>
                                    <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                                        Status
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                                        BC Document
                                    </th>
                                    <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                                        Actions
                                    </th>
                                </tr>
                            </ng-template>
                            
                            <ng-template pTemplate="body" let-outbound let-rowIndex="rowIndex">
                                <tr class="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100" 
                                    [class.bg-gray-25]="rowIndex % 2 === 1">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-semibold text-gray-900">{{ outbound.shipment_number }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-600">{{ outbound.shipment_date | date:'dd MMM yyyy' }}</div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="text-sm text-gray-900 max-w-xs truncate" [title]="outbound.customer_name">
                                            {{ outbound.customer_name }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">{{ outbound.outbound_type }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-center">
                                        <app-status-badge 
                                            [status]="outbound.status" 
                                            [label]="outbound.status"
                                            type="outbound">
                                        </app-status-badge>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">{{ outbound.bc_document_number || '-' }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-center">
                                        <div class="flex items-center justify-center space-x-2">
                                            <button 
                                                pButton 
                                                icon="pi pi-eye" 
                                                class="p-button-text p-button-sm p-button-rounded hover:bg-primary-50 hover:text-primary-600 transition-all duration-200" 
                                                pTooltip="View Details"
                                                tooltipPosition="top"
                                                (click)="onView(outbound)"
                                            ></button>
                                            <button 
                                                pButton 
                                                icon="pi pi-pencil" 
                                                class="p-button-text p-button-sm p-button-rounded hover:bg-blue-50 hover:text-blue-600 transition-all duration-200" 
                                                pTooltip="Edit"
                                                tooltipPosition="top"
                                                (click)="onEdit(outbound)"
                                            ></button>
                                            <button 
                                                pButton 
                                                icon="pi pi-trash" 
                                                class="p-button-text p-button-sm p-button-rounded hover:bg-red-50 hover:text-red-600 transition-all duration-200" 
                                                pTooltip="Delete"
                                                tooltipPosition="top"
                                                (click)="onDelete(outbound)"
                                            ></button>
                                        </div>
                                    </td>
                                </tr>
                            </ng-template>

                            <ng-template pTemplate="emptymessage">
                                <tr>
                                    <td colspan="7" class="p-0">
                                        <app-empty-state
                                            icon="pi pi-truck"
                                            title="No Outbound Shipments Found"
                                            description="There are no outbound shipments to display. Create your first outbound shipment to get started."
                                            primaryActionLabel="Create Outbound Shipment"
                                            primaryActionIcon="pi pi-plus"
                                            (primaryAction)="onCreate()">
                                        </app-empty-state>
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </div>
                </app-enhanced-card>
            </div>
        </div>
    `
})
export class OutboundListComponent implements OnInit {
    private router = inject(Router);
    private outboundService = inject(OutboundDemoService);

    PackageOpenIcon = PackageOpen;
    SearchIcon = Search;
    FilterIcon = Filter;

    outbounds: any[] = [];
    loading = false;
    showFilters = false;
    totalRecords = 0;

    // Page Header Configuration
    breadcrumbs = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Outbound Shipments' }
    ];

    headerActions = [
        {
            label: 'Create Outbound',
            icon: 'pi pi-plus',
            command: () => this.onCreate(),
            styleClass: 'p-button-primary'
        }
    ];

    ngOnInit(): void {
        this.loadOutbounds();
    }

    loadOutbounds(): void {
        this.loading = true;
        this.outboundService.getAllOutbounds().subscribe({
            next: (data) => {
                this.outbounds = data;
                this.totalRecords = data.length;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    onCreate(): void {
        this.router.navigate(['/outbound/new']);
    }

    onView(outbound: any): void {
        this.router.navigate(['/outbound', outbound.id]);
    }

    onEdit(outbound: any): void {
        this.router.navigate(['/outbound', outbound.id, 'edit']);
    }

    onDelete(outbound: any): void {
        // Implement delete logic
        console.log('Delete outbound:', outbound);
    }

    onSearch(event: any): void {
        const query = event.target.value.toLowerCase();
        // Implement search logic here
        console.log('Search query:', query);
    }

    onExport(): void {
        console.log('Export outbound data');
    }
}
