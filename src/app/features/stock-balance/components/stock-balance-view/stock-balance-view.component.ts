import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';

// Lucide icons
import { LucideAngularModule, Package, TriangleAlert, Clock, TrendingDown, TrendingUp } from 'lucide-angular';

// Services
import { StockBalanceService } from '../../services/stock-balance.service';
import { MessageService } from 'primeng/api';

// Models
import {
  StockBalance,
  StockHistory,
  StockAlert,
  StockAgingReport,
  AlertSeverity,
  getMovementTypeLabel
} from '../../models/stock-balance.model';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedTableComponent } from '../../../../shared/components/enhanced-table/enhanced-table.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

/**
 * Stock Balance View Component
 * Requirements: 7.1, 7.4, 7.5, 7.6, 7.7, 7.8
 */
@Component({
  selector: 'app-stock-balance-view',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    SelectModule,
    TabsModule,
    ToastModule,
    LucideAngularModule,
    PageHeaderComponent,
    EnhancedCardComponent,
    EnhancedTableComponent,
    EnhancedButtonComponent,
    StatusBadgeComponent
  ],
  providers: [MessageService],
  templateUrl: './stock-balance-view.component.html',
  styleUrls: ['./stock-balance-view.component.scss']
})
export class StockBalanceViewComponent implements OnInit {
  private stockBalanceService = inject(StockBalanceService);
  private messageService = inject(MessageService);

  // Icons
  PackageIcon = Package;
  AlertTriangleIcon = TriangleAlert;
  ClockIcon = Clock;
  TrendingDownIcon = TrendingDown;
  TrendingUpIcon = TrendingUp;

  balances: StockBalance[] = [];
  filteredBalances: StockBalance[] = [];
  alerts: StockAlert[] = [];
  expiringItems: StockBalance[] = [];
  agingReport: StockAgingReport[] = [];
  history: StockHistory[] = [];

  loading = false;
  searchTerm = '';
  activeTab = 'balance';
  unacknowledgedAlerts = 0;
  rfidEnabled = true; // In production mode, this would be configurable

  ngOnInit(): void {
    this.loadData();
    this.subscribeToRealTimeUpdates();
  }

  loadData(): void {
    this.loading = true;

    // Load balances
    this.stockBalanceService.getAllBalances().subscribe({
      next: (balances) => {
        this.balances = balances;
        this.filteredBalances = balances;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load stock balances'
        });
        this.loading = false;
      }
    });

    // Load alerts
    this.stockBalanceService.getAlerts().subscribe({
      next: (alerts) => {
        this.alerts = alerts;
        this.unacknowledgedAlerts = alerts.filter(a => !a.is_acknowledged).length;
      }
    });

    // Load expiring items
    this.stockBalanceService.getExpiringItems(30).subscribe({
      next: (items) => {
        this.expiringItems = items;
      }
    });

    // Load aging report
    this.stockBalanceService.getStockAgingReport().subscribe({
      next: (report) => {
        this.agingReport = report;
      }
    });

    // Load history
    this.stockBalanceService.getHistory(undefined, undefined, 100).subscribe({
      next: (history) => {
        this.history = history;
      }
    });
  }

  subscribeToRealTimeUpdates(): void {
    this.stockBalanceService.getBalanceUpdates().subscribe({
      next: (balance) => {
        if (balance) {
          this.messageService.add({
            severity: 'info',
            summary: 'Stock Updated',
            detail: `${balance.item_name} balance updated in ${balance.warehouse_name}`
          });
          this.loadData(); // Reload data
        }
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredBalances = this.balances.filter(b =>
      b.item_code.toLowerCase().includes(term) ||
      b.item_name.toLowerCase().includes(term) ||
      b.warehouse_code.toLowerCase().includes(term) ||
      b.warehouse_name.toLowerCase().includes(term)
    );
  }

  onTabChange(): void {
    // Reload data when switching tabs
    if (this.activeTab === 'alerts') {
      this.stockBalanceService.getAlerts().subscribe({
        next: (alerts) => {
          this.alerts = alerts;
        }
      });
    }
  }

  onRFIDScan(): void {
    // In a real app, this would trigger RFID scanner
    const rfidTag = prompt('Enter RFID tag:');
    if (rfidTag) {
      this.stockBalanceService.searchByRFID(rfidTag).subscribe({
        next: (balance) => {
          if (balance) {
            this.filteredBalances = [balance];
            this.messageService.add({
              severity: 'success',
              summary: 'Found',
              detail: `Found ${balance.item_name} in ${balance.warehouse_name}`
            });
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Not Found',
              detail: 'No item found with this RFID tag'
            });
          }
        }
      });
    }
  }

  acknowledgeAlert(alert: StockAlert): void {
    this.stockBalanceService.acknowledgeAlert(alert.id, 'admin').subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Alert acknowledged'
        });
        this.loadData();
      }
    });
  }

  isExpiringSoon(expiryDate: Date): boolean {
    const days = this.getDaysUntilExpiry(expiryDate);
    return days <= 30;
  }

  getDaysUntilExpiry(expiryDate: Date): number {
    const today = new Date();
    const diffTime = new Date(expiryDate).getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getSeverityTag(severity: AlertSeverity): 'success' | 'secondary' | 'info' | 'warn' | 'danger' {
    const map: Record<AlertSeverity, 'success' | 'secondary' | 'info' | 'warn' | 'danger'> = {
      [AlertSeverity.INFO]: 'info',
      [AlertSeverity.WARNING]: 'warn',
      [AlertSeverity.CRITICAL]: 'danger'
    };
    return map[severity];
  }

  getMovementTypeLabel(type: any): string {
    return getMovementTypeLabel(type);
  }
}
