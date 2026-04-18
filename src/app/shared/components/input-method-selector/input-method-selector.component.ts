import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

export enum InputMethod {
    EXCEL = 'EXCEL',
    API = 'API',
    MANUAL = 'MANUAL'
}

export interface InputMethodOption {
    label: string;
    value: InputMethod;
    icon: string;
    description?: string;
    disabled?: boolean;
}

/**
 * Reusable Input Method Selector Component
 * Provides consistent UI for selecting input methods across forms
 */
@Component({
    selector: 'app-input-method-selector',
    standalone: true,
    imports: [CommonModule, CardModule],
    template: `
    <p-card>
      <ng-template pTemplate="header">
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <p *ngIf="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
        </div>
      </ng-template>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          *ngFor="let method of methods"
          class="input-method-card p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
          [class.border-blue-500]="selectedMethod === method.value"
          [class.bg-blue-50]="selectedMethod === method.value"
          [class.border-gray-300]="selectedMethod !== method.value"
          [class.opacity-50]="method.disabled"
          [class.cursor-not-allowed]="method.disabled"
          (click)="!method.disabled && onMethodSelect(method.value)"
        >
          <div class="flex flex-col items-center text-center">
            <!-- Icon -->
            <div class="mb-4">
              <i 
                [class]="method.icon + ' text-4xl'"
                [class.text-blue-600]="selectedMethod === method.value && !method.disabled"
                [class.text-gray-600]="selectedMethod !== method.value && !method.disabled"
                [class.text-gray-400]="method.disabled"
              ></i>
            </div>
            
            <!-- Label -->
            <h4 
              class="font-semibold text-lg mb-2"
              [class.text-blue-900]="selectedMethod === method.value && !method.disabled"
              [class.text-gray-900]="selectedMethod !== method.value && !method.disabled"
              [class.text-gray-400]="method.disabled"
            >
              {{ method.label }}
            </h4>
            
            <!-- Description -->
            <p 
              *ngIf="method.description"
              class="text-sm"
              [class.text-blue-700]="selectedMethod === method.value && !method.disabled"
              [class.text-gray-600]="selectedMethod !== method.value && !method.disabled"
              [class.text-gray-400]="method.disabled"
            >
              {{ method.description }}
            </p>

            <!-- Disabled Badge -->
            <span 
              *ngIf="method.disabled" 
              class="mt-2 px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded-full"
            >
              Coming Soon
            </span>

            <!-- Selected Badge -->
            <div 
              *ngIf="selectedMethod === method.value && !method.disabled"
              class="mt-3 flex items-center text-blue-600"
            >
              <i class="pi pi-check-circle mr-1"></i>
              <span class="text-sm font-medium">Selected</span>
            </div>
          </div>
        </div>
      </div>
    </p-card>
  `,
    styles: [`
    .input-method-card {
      min-height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .input-method-card:hover:not(.opacity-50) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .input-method-card.border-blue-500 {
      box-shadow: 0 0 0 1px rgb(59 130 246 / 0.5);
    }
  `]
})
export class InputMethodSelectorComponent {
    @Input() title = 'Select Input Method';
    @Input() subtitle = 'Choose how you want to input your data';
    @Input() selectedMethod: InputMethod | null = null;
    @Input() methods: InputMethodOption[] = [
        {
            label: 'Excel Upload',
            value: InputMethod.EXCEL,
            icon: 'pi pi-file-excel',
            description: 'Upload data from Excel file with validation'
        },
        {
            label: 'API Integration',
            value: InputMethod.API,
            icon: 'pi pi-cloud-download',
            description: 'Fetch data from external systems automatically'
        },
        {
            label: 'Manual Entry',
            value: InputMethod.MANUAL,
            icon: 'pi pi-pencil',
            description: 'Enter data manually using the form'
        }
    ];

    @Output() methodSelected = new EventEmitter<InputMethod>();

    onMethodSelect(method: InputMethod): void {
        this.selectedMethod = method;
        this.methodSelected.emit(method);
    }
}