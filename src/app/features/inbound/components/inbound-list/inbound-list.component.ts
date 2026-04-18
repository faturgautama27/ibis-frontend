import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { LucideAngularModule, PackageCheck, Plus, Search, Filter } from 'lucide-angular';
import { InboundDemoService } from '../../services/inbound-demo.service';
import { MessageService } from 'primeng/api';
import { InboundHeader, getInboundStatusLabel } from '../../models/inbound.model';

// Enhanced Components
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-inbound-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToastModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    LucideAngularModule,
    EnhancedCardComponent,
    PageHeaderComponent,
    StatusBadgeComponent,
    EmptyStateComponent
  ],
  providers: [MessageService],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Enhanced Page Header -->
      <app-page-header
        title="Inbound Receipts"
        subtitle="Manage inbound receipts and deliveries"
        icon="pi pi-box"
        [breadcrumbs]="breadcrumbs"
        [primaryAction]="{ label: 'Create Inbound', icon: 'pi pi-plus' }"
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
                  placeholder="Search inbound receipts..." 
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
                    <option value="received">Received</option>
                    <option value="completed">Completed</option>
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                  <select class="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option value="">All Suppliers</option>
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
              [value]="inbounds" 
              [paginator]="true" 
              [rows]="20" 
              [loading]="loading"
              [showCurrentPageReport]="true" 
              currentPageReportTemplate="{first} - {last} of {totalRecords} inbound receipts"
              [rowsPerPageOptions]="[10, 20, 50]"
              styleClass="enhanced-table"
              [globalFilterFields]="['inbound_number', 'supplier_name', 'bc_document_number']"
              responsiveLayout="scroll"
            >
              <ng-template pTemplate="header">
                <tr class="bg-gray-50">
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                    Inbound Number
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                    Date
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                    BC Document
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                    Supplier
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                    Warehouse
                  </th>
                  <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                    Total Qty
                  </th>
                  <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                    Status
                  </th>
                  <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                    Actions
                  </th>
                </tr>
              </ng-template>
              
              <ng-template pTemplate="body" let-inbound let-rowIndex="rowIndex">
                <tr class="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100" 
                    [class.bg-gray-25]="rowIndex % 2 === 1">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-semibold text-gray-900">{{ inbound.inbound_number }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-600">{{ inbound.inbound_date | date: 'dd MMM yyyy' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ inbound.bc_document_number }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 max-w-xs truncate" [title]="inbound.supplier_name">
                      {{ inbound.supplier_name }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 max-w-xs truncate" [title]="inbound.warehouse_name">
                      {{ inbound.warehouse_name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="text-sm font-medium text-gray-900">
                      {{ inbound.total_quantity | number: '1.0-0' }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <app-status-badge 
                      [status]="inbound.status" 
                      [label]="getInboundStatusLabel(inbound.status)"
                      type="inbound">
                    </app-status-badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="flex items-center justify-center space-x-2">
                      <button 
                        pButton 
                        icon="pi pi-eye" 
                        class="p-button-text p-button-sm p-button-rounded hover:bg-primary-50 hover:text-primary-600 transition-all duration-200" 
                        pTooltip="View Details"
                        tooltipPosition="top"
                        (click)="onView(inbound)"
                      ></button>
                      <button 
                        pButton 
                        icon="pi pi-pencil" 
                        class="p-button-text p-button-sm p-button-rounded hover:bg-blue-50 hover:text-blue-600 transition-all duration-200" 
                        pTooltip="Edit"
                        tooltipPosition="top"
                        (click)="onEdit(inbound)"
                      ></button>
                    </div>
                  </td>
                </tr>
              </ng-template>

              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="8" class="p-0">
                    <app-empty-state
                      icon="pi pi-box"
                      title="No Inbound Receipts Found"
                      description="There are no inbound receipts to display. Create your first inbound receipt to get started."
                      primaryActionLabel="Create Inbound Receipt"
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
    <p-toast />
  `,
})
export class InboundListComponent implements OnInit {
  private router = inject(Router);
  private inboundService = inject(InboundDemoService);
  private messageService = inject(MessageService);

  PackageCheckIcon = PackageCheck;
  PlusIcon = Plus;
  SearchIcon = Search;
  FilterIcon = Filter;

  inbounds: InboundHeader[] = [];
  loading = false;
  showFilters = false;
  totalRecords = 0;

  // Page Header Configuration
  breadcrumbs = [
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Inbound Receipts' }
  ];

  headerActions = [
    {
      label: 'Create Inbound',
      icon: 'pi pi-plus',
      command: () => this.onCreate(),
      styleClass: 'p-button-primary'
    }
  ];

  ngOnInit(): void {
    this.loadInbounds();
  }

  loadInbounds(): void {
    this.loading = true;
    this.inboundService.getAll().subscribe({
      next: (data) => {
        this.inbounds = data;
        this.totalRecords = data.length;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load inbound receipts'
        });
        this.loading = false;
      }
    });
  }

  onCreate(): void {
    this.router.navigate(['/inbound/create']);
  }

  onView(inbound: InboundHeader): void {
    this.router.navigate(['/inbound', inbound.id]);
  }

  onEdit(inbound: InboundHeader): void {
    this.router.navigate(['/inbound', inbound.id, 'edit']);
  }

  onSearch(event: any): void {
    const query = event.target.value.toLowerCase();
    // Implement search logic here
    console.log('Search query:', query);
  }

  onExport(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Export',
      detail: 'Export functionality will be implemented'
    });
  }

  getInboundStatusLabel(status: any): string {
    return getInboundStatusLabel(status);
  }
}
