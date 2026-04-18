import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

/**
 * Page Header Component
 * Provides enhanced page headers with prominent titles, proper spacing, and action buttons
 * Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 25.6
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, MenuModule],
  template: `
    <div class="bg-white border-b border-gray-200 shadow-sm relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 bg-gradient-to-r from-gray-50/50 via-transparent to-primary-50/30 opacity-60"></div>
      
      <div class="px-6 py-6 relative z-10">
        <!-- Main Header Content -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- Title Section -->
          <div class="flex items-center gap-4">
            <!-- Back Button -->
            <p-button
              *ngIf="showBackButton"
              icon="pi pi-arrow-left"
              [rounded]="true"
              severity="secondary"
              [outlined]="true"
              styleClass="hover:bg-gray-50 hover:shadow-md hover:scale-105 transition-all duration-200 border-2"
              (onClick)="onBack()">
            </p-button>

            <!-- Icon -->
            <div *ngIf="icon" class="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
              <i [class]="icon" class="text-primary-600 text-xl"></i>
            </div>

            <!-- Title and Subtitle -->
            <div class="flex flex-col">
              <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
                {{ title }}
              </h1>
              <p *ngIf="subtitle" class="text-base text-gray-600 mb-0 font-medium">
                {{ subtitle }}
              </p>
              
              <!-- Breadcrumb -->
              <nav *ngIf="breadcrumbs && breadcrumbs.length > 0" class="flex mt-2" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-2 text-sm">
                  <li *ngFor="let crumb of breadcrumbs; let last = last" class="flex items-center">
                    <a *ngIf="!last && crumb.route" 
                       [routerLink]="crumb.route"
                       class="text-gray-500 hover:text-primary-600 transition-all duration-200 hover:underline font-medium">
                      {{ crumb.label }}
                    </a>
                    <span *ngIf="last" class="text-gray-700 font-semibold">{{ crumb.label }}</span>
                    <i *ngIf="!last" class="pi pi-chevron-right text-gray-400 text-xs mx-2 transition-colors duration-200"></i>
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <!-- Actions Section -->
          <div class="flex items-center gap-3 flex-wrap">
            <!-- Custom Actions Slot -->
            <ng-content select="[slot=actions]"></ng-content>

            <!-- Primary Action -->
            <p-button
              *ngIf="primaryAction"
              [label]="primaryAction.label"
              [icon]="primaryAction.icon"
              [severity]="primaryAction.severity || 'primary'"
              [loading]="primaryAction.loading"
              [disabled]="primaryAction.disabled"
              styleClass="shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold"
              (onClick)="onPrimaryAction()">
            </p-button>

            <!-- Secondary Actions Menu -->
            <p-button
              *ngIf="secondaryActions && secondaryActions.length > 0"
              icon="pi pi-ellipsis-v"
              [rounded]="true"
              severity="secondary"
              [outlined]="true"
              styleClass="hover:bg-gray-50 hover:shadow-md hover:scale-105 transition-all duration-200 border-2"
              (onClick)="toggleActionsMenu($event)"
              #menuButton>
            </p-button>

            <p-menu
              #actionsMenu
              [model]="secondaryActions"
              [popup]="true"
              styleClass="shadow-xl border border-gray-200 rounded-xl overflow-hidden">
            </p-menu>
          </div>
        </div>

        <!-- Stats/Metrics Section -->
        <div *ngIf="showStats && stats && stats.length > 0" class="mt-6 pt-6 border-t border-gray-200">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div *ngFor="let stat of stats" class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 hover:from-gray-100 hover:to-gray-50 hover:shadow-md hover:scale-[1.02] transition-all duration-200 border border-gray-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">{{ stat.label }}</p>
                  <p class="text-2xl font-bold text-gray-900 mb-0">{{ stat.value }}</p>
                  <p *ngIf="stat.change" class="text-xs mt-1 font-medium"
                     [class.text-green-600]="stat.changeType === 'positive'"
                     [class.text-red-600]="stat.changeType === 'negative'"
                     [class.text-gray-600]="stat.changeType === 'neutral'">
                    {{ stat.change }}
                  </p>
                </div>
                <div *ngIf="stat.icon" class="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:scale-110"
                     [class.bg-green-100]="stat.changeType === 'positive'"
                     [class.bg-red-100]="stat.changeType === 'negative'"
                     [class.bg-gray-100]="stat.changeType === 'neutral'">
                  <i [class]="stat.icon" 
                     [class.text-green-600]="stat.changeType === 'positive'"
                     [class.text-red-600]="stat.changeType === 'negative'"
                     [class.text-gray-600]="stat.changeType === 'neutral'"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs Section -->
        <div *ngIf="tabs && tabs.length > 0" class="mt-6">
          <nav class="flex space-x-8 border-b border-gray-200" aria-label="Tabs">
            <button
              *ngFor="let tab of tabs"
              type="button"
              class="py-3 px-1 border-b-2 font-semibold text-sm transition-all duration-200 hover:scale-105 relative group"
              [class.border-primary-500]="tab.active"
              [class.text-primary-600]="tab.active"
              [class.border-transparent]="!tab.active"
              [class.text-gray-500]="!tab.active"
              [class.hover:text-gray-700]="!tab.active"
              [class.hover:border-gray-300]="!tab.active"
              (click)="onTabClick(tab)">
              
              <!-- Active tab indicator -->
              <div *ngIf="tab.active" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-400 rounded-t-full"></div>
              
              <i *ngIf="tab.icon" [class]="tab.icon" class="mr-2 transition-transform duration-200 group-hover:scale-110"></i>
              {{ tab.label }}
              <span *ngIf="tab.count !== undefined" 
                    class="ml-2 py-0.5 px-2 rounded-full text-xs font-bold transition-all duration-200"
                    [class.bg-primary-100]="tab.active"
                    [class.text-primary-700]="tab.active"
                    [class.bg-gray-100]="!tab.active"
                    [class.text-gray-600]="!tab.active">
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
    }

    /* Enhanced hover effects */
    .hover-lift {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hover-lift:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
      .grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 480px) {
      .grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4 {
        grid-template-columns: repeat(1, minmax(0, 1fr));
      }
    }

    /* Animation for stats cards */
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .stats-card {
      animation: slideInUp 0.3s ease-out forwards;
    }

    /* Tab hover effects */
    .tab-button {
      position: relative;
      overflow: hidden;
    }

    .tab-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
      transition: left 0.5s ease;
    }

    .tab-button:hover::before {
      left: 100%;
    }

    /* Focus states for accessibility */
    button:focus-visible {
      outline: 2px solid rgb(59, 130, 246);
      outline-offset: 2px;
      border-radius: 0.375rem;
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .border-gray-200 {
        border-color: rgb(0, 0, 0);
      }
      
      .text-gray-600 {
        color: rgb(0, 0, 0);
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `]
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() showBackButton = false;
  @Input() breadcrumbs: { label: string; route?: string }[] = [];

  // Primary action configuration
  @Input() primaryAction?: {
    label: string;
    icon?: string;
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger';
    loading?: boolean;
    disabled?: boolean;
  };

  // Secondary actions (dropdown menu)
  @Input() secondaryActions: MenuItem[] = [];

  // Stats/metrics section
  @Input() showStats = false;
  @Input() stats: {
    label: string;
    value: string | number;
    icon?: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
  }[] = [];

  // Tabs section
  @Input() tabs: {
    label: string;
    icon?: string;
    active?: boolean;
    count?: number;
    id?: string;
  }[] = [];

  @ContentChild('customActions') customActionsTemplate?: TemplateRef<any>;

  @Output() back = new EventEmitter<void>();
  @Output() primaryActionClick = new EventEmitter<void>();
  @Output() tabClick = new EventEmitter<any>();

  onBack(): void {
    this.back.emit();
  }

  onPrimaryAction(): void {
    this.primaryActionClick.emit();
  }

  onTabClick(tab: any): void {
    // Update active state
    this.tabs.forEach(t => t.active = false);
    tab.active = true;

    this.tabClick.emit(tab);
  }

  toggleActionsMenu(event: Event): void {
    // Menu toggle is handled by PrimeNG
  }
}