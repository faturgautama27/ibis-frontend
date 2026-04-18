import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { DashboardService, DashboardMetrics } from '../../services/dashboard.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * Main Dashboard Component
 * Requirements: 16.1-16.9
 */
@Component({
    selector: 'app-main-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ChartModule,
        TableModule,
        TagModule,
        TimelineModule,
        ButtonModule,
        EnhancedCardComponent,
        StatusBadgeComponent
    ],
    template: `
        <div class="dashboard-container">
            <!-- Page Header -->
            <div class="page-header">
                <div class="header-content">
                    <div class="header-text">
                        <h1 class="page-title">Dashboard</h1>
                        <p class="page-subtitle">Real-time inventory insights and system overview</p>
                    </div>
                    <div class="header-actions">
                        <p-button 
                            icon="pi pi-refresh" 
                            label="Refresh" 
                            severity="secondary"
                            size="small"
                            (onClick)="loadDashboardData()">
                        </p-button>
                    </div>
                </div>
            </div>

            <!-- Metrics Cards -->
            <div class="metrics-grid">
                <!-- Total Stock Value Card -->
                <app-enhanced-card 
                    variant="stats" 
                    class="metric-card metric-card-primary">
                    <div class="metric-content">
                        <div class="metric-info">
                            <div class="metric-label">Total Stock Value</div>
                            <div class="metric-value">{{ formatCurrency(metrics.total_stock_value) }}</div>
                            <div class="metric-change positive">
                                <i class="pi pi-arrow-up"></i>
                                <span>+12.5% from last month</span>
                            </div>
                        </div>
                        <div class="metric-icon primary">
                            <i class="pi pi-dollar"></i>
                        </div>
                    </div>
                </app-enhanced-card>

                <!-- Total Items Card -->
                <app-enhanced-card 
                    variant="stats" 
                    class="metric-card metric-card-success">
                    <div class="metric-content">
                        <div class="metric-info">
                            <div class="metric-label">Total Items</div>
                            <div class="metric-value">{{ formatNumber(metrics.total_items) }}</div>
                            <div class="metric-change positive">
                                <i class="pi pi-arrow-up"></i>
                                <span>+8.2% from last month</span>
                            </div>
                        </div>
                        <div class="metric-icon success">
                            <i class="pi pi-box"></i>
                        </div>
                    </div>
                </app-enhanced-card>

                <!-- Low Stock Alerts Card -->
                <app-enhanced-card 
                    variant="stats" 
                    class="metric-card metric-card-warning">
                    <div class="metric-content">
                        <div class="metric-info">
                            <div class="metric-label">Low Stock Alerts</div>
                            <div class="metric-value">{{ metrics.low_stock_count }}</div>
                            <div class="metric-change neutral">
                                <i class="pi pi-minus"></i>
                                <span>No change</span>
                            </div>
                        </div>
                        <div class="metric-icon warning">
                            <i class="pi pi-exclamation-triangle"></i>
                        </div>
                    </div>
                </app-enhanced-card>

                <!-- Expiring Soon Card -->
                <app-enhanced-card 
                    variant="stats" 
                    class="metric-card metric-card-danger">
                    <div class="metric-content">
                        <div class="metric-info">
                            <div class="metric-label">Expiring Soon</div>
                            <div class="metric-value">{{ metrics.expiring_items_count }}</div>
                            <div class="metric-change negative">
                                <i class="pi pi-arrow-down"></i>
                                <span>-3 from yesterday</span>
                            </div>
                        </div>
                        <div class="metric-icon danger">
                            <i class="pi pi-calendar-times"></i>
                        </div>
                    </div>
                </app-enhanced-card>
            </div>

            <!-- Charts Section -->
            <div class="charts-section">
                <div class="charts-grid">
                    <!-- Stock Movement Trends -->
                    <app-enhanced-card 
                        variant="standard" 
                        title="Stock Movement Trends" 
                        subtitle="Last 30 days overview"
                        [header]="true"
                        class="chart-card">
                        <div class="chart-container">
                            <p-chart 
                                type="line" 
                                [data]="movementChartData" 
                                [options]="chartOptions"
                                class="dashboard-chart">
                            </p-chart>
                        </div>
                    </app-enhanced-card>

                    <!-- Warehouse Utilization -->
                    <app-enhanced-card 
                        variant="standard" 
                        title="Warehouse Utilization" 
                        subtitle="Current capacity usage"
                        [header]="true"
                        class="chart-card">
                        <div class="chart-container">
                            <p-chart 
                                type="bar" 
                                [data]="utilizationChartData" 
                                [options]="chartOptions"
                                class="dashboard-chart">
                            </p-chart>
                        </div>
                    </app-enhanced-card>
                </div>

                <!-- Production Efficiency Chart -->
                <app-enhanced-card 
                    variant="standard" 
                    title="Production Efficiency" 
                    subtitle="6-month performance overview"
                    [header]="true"
                    class="chart-card full-width">
                    <div class="chart-container large">
                        <p-chart 
                            type="bar" 
                            [data]="efficiencyChartData" 
                            [options]="chartOptions"
                            class="dashboard-chart">
                        </p-chart>
                    </div>
                </app-enhanced-card>
            </div>

            <!-- Bottom Section -->
            <div class="bottom-section">
                <div class="bottom-grid">
                    <!-- Pending Transactions -->
                    <app-enhanced-card 
                        variant="standard" 
                        title="Pending Transactions" 
                        subtitle="Requires attention"
                        [header]="true"
                        class="transactions-card">
                        <div class="transactions-list">
                            <div class="transaction-item inbound">
                                <div class="transaction-info">
                                    <div class="transaction-label">Pending Inbound</div>
                                    <div class="transaction-description">Awaiting receipt confirmation</div>
                                </div>
                                <div class="transaction-value">{{ metrics.pending_inbound }}</div>
                                <div class="transaction-icon">
                                    <i class="pi pi-arrow-down"></i>
                                </div>
                            </div>
                            
                            <div class="transaction-item outbound">
                                <div class="transaction-info">
                                    <div class="transaction-label">Pending Outbound</div>
                                    <div class="transaction-description">Ready for shipment</div>
                                </div>
                                <div class="transaction-value">{{ metrics.pending_outbound }}</div>
                                <div class="transaction-icon">
                                    <i class="pi pi-arrow-up"></i>
                                </div>
                            </div>
                            
                            <div class="transaction-item production">
                                <div class="transaction-info">
                                    <div class="transaction-label">Pending Production</div>
                                    <div class="transaction-description">In manufacturing queue</div>
                                </div>
                                <div class="transaction-value">{{ metrics.pending_production }}</div>
                                <div class="transaction-icon">
                                    <i class="pi pi-cog"></i>
                                </div>
                            </div>
                        </div>
                    </app-enhanced-card>

                    <!-- Recent Activities -->
                    <app-enhanced-card 
                        variant="standard" 
                        title="Recent Activities" 
                        subtitle="Latest system updates"
                        [header]="true"
                        class="activities-card">
                        <div class="activities-list">
                            @for (activity of recentActivities; track activity.id) {
                                <div class="activity-item">
                                    <div class="activity-indicator">
                                        <i class="pi pi-circle-fill"></i>
                                    </div>
                                    <div class="activity-content">
                                        <div class="activity-title">{{ activity.movement_type }}</div>
                                        <div class="activity-description">
                                            {{ activity.item_name }} - {{ activity.quantity_change }} {{ activity.unit }}
                                        </div>
                                        <div class="activity-time">{{ activity.movement_date | date:'short' }}</div>
                                    </div>
                                    <app-status-badge 
                                        [label]="getActivityStatus(activity.movement_type)"
                                        [status]="activity.movement_type"
                                        [autoSeverity]="true"
                                        size="sm">
                                    </app-status-badge>
                                </div>
                            }
                            @empty {
                                <div class="empty-state">
                                    <i class="pi pi-info-circle"></i>
                                    <span>No recent activities</span>
                                </div>
                            }
                        </div>
                    </app-enhanced-card>
                </div>
            </div>

            <!-- Auto-refresh Indicator -->
            <div class="refresh-indicator">
                <div class="refresh-content">
                    <i class="pi pi-sync" [class.spinning]="isRefreshing"></i>
                    <span>Auto-refresh: {{ countdown }}s</span>
                </div>
            </div>
        </div>
    `,
    styles: [`
        /* Dashboard Container */
        .dashboard-container {
            padding: var(--padding-lg);
            background: var(--gray-50);
            min-height: 100vh;
        }

        /* Page Header */
        .page-header {
            margin-bottom: var(--space-8);
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: var(--space-6);
        }

        .header-text {
            flex: 1;
        }

        .page-title {
            font-size: var(--text-4xl);
            font-weight: var(--font-bold);
            color: var(--gray-900);
            margin: 0 0 var(--space-2) 0;
            line-height: var(--leading-tight);
        }

        .page-subtitle {
            font-size: var(--text-lg);
            color: var(--gray-600);
            margin: 0;
            line-height: var(--leading-normal);
        }

        .header-actions {
            display: flex;
            gap: var(--space-3);
            align-items: center;
        }

        /* Metrics Grid */
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: var(--space-6);
            margin-bottom: var(--space-8);
        }

        .metric-card {
            transition: all var(--duration-normal) var(--ease-out);
        }

        .metric-card:hover {
            transform: var(--card-hover-transform);
            box-shadow: var(--card-hover-shadow);
        }

        .metric-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: var(--space-4);
        }

        .metric-info {
            flex: 1;
        }

        .metric-label {
            font-size: var(--text-sm);
            font-weight: var(--font-medium);
            color: var(--gray-600);
            margin-bottom: var(--space-2);
            text-transform: uppercase;
            letter-spacing: var(--tracking-wide);
        }

        .metric-value {
            font-size: var(--text-3xl);
            font-weight: var(--font-bold);
            color: var(--gray-900);
            margin-bottom: var(--space-3);
            line-height: var(--leading-tight);
        }

        .metric-change {
            display: flex;
            align-items: center;
            gap: var(--space-1);
            font-size: var(--text-sm);
            font-weight: var(--font-medium);
        }

        .metric-change.positive {
            color: var(--success-600);
        }

        .metric-change.negative {
            color: var(--error-600);
        }

        .metric-change.neutral {
            color: var(--gray-500);
        }

        .metric-icon {
            width: 64px;
            height: 64px;
            border-radius: var(--radius-xl);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--text-3xl);
            flex-shrink: 0;
        }

        .metric-icon.primary {
            background: var(--primary-100);
            color: var(--primary-600);
        }

        .metric-icon.success {
            background: var(--success-100);
            color: var(--success-600);
        }

        .metric-icon.warning {
            background: var(--warning-100);
            color: var(--warning-600);
        }

        .metric-icon.danger {
            background: var(--error-100);
            color: var(--error-600);
        }

        /* Charts Section */
        .charts-section {
            margin-bottom: var(--space-8);
        }

        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: var(--space-6);
            margin-bottom: var(--space-6);
        }

        .chart-card {
            min-height: 400px;
        }

        .chart-card.full-width {
            grid-column: 1 / -1;
        }

        .chart-container {
            height: 300px;
            position: relative;
        }

        .chart-container.large {
            height: 400px;
        }

        .dashboard-chart {
            width: 100%;
            height: 100%;
        }

        /* Bottom Section */
        .bottom-section {
            margin-bottom: var(--space-8);
        }

        .bottom-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: var(--space-6);
        }

        /* Transactions Card */
        .transactions-list {
            display: flex;
            flex-direction: column;
            gap: var(--space-4);
        }

        .transaction-item {
            display: flex;
            align-items: center;
            gap: var(--space-4);
            padding: var(--padding-md);
            border-radius: var(--radius-lg);
            transition: all var(--duration-fast) var(--ease-out);
        }

        .transaction-item:hover {
            background: var(--gray-50);
        }

        .transaction-item.inbound {
            background: var(--primary-50);
            border: 1px solid var(--primary-200);
        }

        .transaction-item.outbound {
            background: var(--success-50);
            border: 1px solid var(--success-200);
        }

        .transaction-item.production {
            background: var(--warning-50);
            border: 1px solid var(--warning-200);
        }

        .transaction-info {
            flex: 1;
        }

        .transaction-label {
            font-size: var(--text-base);
            font-weight: var(--font-semibold);
            color: var(--gray-900);
            margin-bottom: var(--space-1);
        }

        .transaction-description {
            font-size: var(--text-sm);
            color: var(--gray-600);
        }

        .transaction-value {
            font-size: var(--text-2xl);
            font-weight: var(--font-bold);
            color: var(--gray-900);
            margin-right: var(--space-3);
        }

        .transaction-icon {
            width: 40px;
            height: 40px;
            border-radius: var(--radius-lg);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--text-lg);
            background: white;
            box-shadow: var(--shadow-sm);
        }

        .transaction-item.inbound .transaction-icon {
            color: var(--primary-600);
        }

        .transaction-item.outbound .transaction-icon {
            color: var(--success-600);
        }

        .transaction-item.production .transaction-icon {
            color: var(--warning-600);
        }

        /* Activities Card */
        .activities-list {
            display: flex;
            flex-direction: column;
            gap: var(--space-3);
            max-height: 400px;
            overflow-y: auto;
        }

        .activity-item {
            display: flex;
            align-items: flex-start;
            gap: var(--space-3);
            padding: var(--padding-sm);
            border-radius: var(--radius-md);
            transition: all var(--duration-fast) var(--ease-out);
        }

        .activity-item:hover {
            background: var(--gray-50);
        }

        .activity-indicator {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: var(--space-1);
        }

        .activity-indicator i {
            font-size: 8px;
            color: var(--primary-500);
        }

        .activity-content {
            flex: 1;
            min-width: 0;
        }

        .activity-title {
            font-size: var(--text-sm);
            font-weight: var(--font-medium);
            color: var(--gray-900);
            margin-bottom: var(--space-1);
        }

        .activity-description {
            font-size: var(--text-xs);
            color: var(--gray-600);
            margin-bottom: var(--space-1);
        }

        .activity-time {
            font-size: var(--text-xs);
            color: var(--gray-500);
        }

        .empty-state {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-2);
            padding: var(--padding-xl);
            color: var(--gray-500);
            font-size: var(--text-sm);
        }

        .empty-state i {
            font-size: var(--text-lg);
        }

        /* Auto-refresh Indicator */
        .refresh-indicator {
            position: fixed;
            bottom: var(--space-6);
            right: var(--space-6);
            z-index: var(--z-tooltip);
        }

        .refresh-content {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            padding: var(--padding-sm) var(--padding-md);
            background: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--gray-200);
            font-size: var(--text-sm);
            color: var(--gray-600);
        }

        .refresh-content i.spinning {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .dashboard-container {
                padding: var(--padding-md);
            }

            .header-content {
                flex-direction: column;
                align-items: stretch;
                gap: var(--space-4);
            }

            .page-title {
                font-size: var(--text-3xl);
            }

            .metrics-grid {
                grid-template-columns: 1fr;
                gap: var(--space-4);
            }

            .charts-grid {
                grid-template-columns: 1fr;
                gap: var(--space-4);
            }

            .bottom-grid {
                grid-template-columns: 1fr;
                gap: var(--space-4);
            }

            .chart-container,
            .chart-container.large {
                height: 250px;
            }

            .refresh-indicator {
                bottom: var(--space-4);
                right: var(--space-4);
            }
        }

        @media (max-width: 480px) {
            .metric-content {
                flex-direction: column;
                align-items: center;
                text-align: center;
                gap: var(--space-3);
            }

            .metric-icon {
                width: 48px;
                height: 48px;
                font-size: var(--text-2xl);
            }

            .metric-value {
                font-size: var(--text-2xl);
            }

            .transaction-item {
                flex-direction: column;
                align-items: stretch;
                text-align: center;
                gap: var(--space-2);
            }

            .transaction-value {
                margin-right: 0;
                margin-bottom: var(--space-2);
            }
        }
    `]
})
export class MainDashboardComponent implements OnInit, OnDestroy {
    private dashboardService = inject(DashboardService);
    private refreshSubscription?: Subscription;
    private countdownSubscription?: Subscription;

    metrics: DashboardMetrics = {
        total_stock_value: 0,
        total_items: 0,
        total_warehouses: 0,
        low_stock_count: 0,
        expiring_items_count: 0,
        pending_inbound: 0,
        pending_outbound: 0,
        pending_production: 0
    };

    recentActivities: any[] = [];
    countdown = 300; // 5 minutes
    isRefreshing = false;

    movementChartData: any;
    utilizationChartData: any;
    efficiencyChartData: any;
    chartOptions: any;

    ngOnInit(): void {
        this.initChartOptions();
        this.loadDashboardData();
        this.startAutoRefresh();
    }

    ngOnDestroy(): void {
        this.refreshSubscription?.unsubscribe();
        this.countdownSubscription?.unsubscribe();
    }

    loadDashboardData(): void {
        this.isRefreshing = true;

        // Load metrics
        this.dashboardService.getDashboardMetrics().subscribe({
            next: (metrics) => {
                this.metrics = metrics;
                this.isRefreshing = false;
            },
            error: () => {
                this.isRefreshing = false;
            }
        });

        // Load stock movement trends
        this.dashboardService.getStockMovementTrends(30).subscribe(trends => {
            this.movementChartData = {
                labels: trends.map(t => new Date(t.date).toLocaleDateString()),
                datasets: [
                    {
                        label: 'Inbound',
                        data: trends.map(t => t.inbound),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Outbound',
                        data: trends.map(t => t.outbound),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Production',
                        data: trends.map(t => t.production),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4
                    }
                ]
            };
        });

        // Load warehouse utilization
        this.dashboardService.getWarehouseUtilization().subscribe(utilization => {
            this.utilizationChartData = {
                labels: utilization.map(u => u.warehouse_name),
                datasets: [
                    {
                        label: 'Utilization %',
                        data: utilization.map(u => u.utilization_percentage),
                        backgroundColor: '#3b82f6'
                    }
                ]
            };
        });

        // Load production efficiency
        this.dashboardService.getProductionEfficiency(6).subscribe(efficiency => {
            this.efficiencyChartData = {
                labels: efficiency.map(e => e.period),
                datasets: [
                    {
                        label: 'Efficiency %',
                        data: efficiency.map(e => e.efficiency_percentage),
                        backgroundColor: '#10b981'
                    },
                    {
                        label: 'Scrap %',
                        data: efficiency.map(e => e.scrap_percentage),
                        backgroundColor: '#ef4444'
                    }
                ]
            };
        });

        // Load recent activities
        this.dashboardService.getRecentActivities(10).subscribe(activities => {
            this.recentActivities = activities;
        });
    }

    startAutoRefresh(): void {
        // Refresh every 5 minutes
        this.refreshSubscription = interval(300000).pipe(
            switchMap(() => {
                this.loadDashboardData();
                return [];
            })
        ).subscribe();

        // Countdown timer
        this.countdown = 300;
        this.countdownSubscription = interval(1000).subscribe(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                this.countdown = 300;
            }
        });
    }

    initChartOptions(): void {
        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };
    }

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    }

    formatNumber(value: number): string {
        return new Intl.NumberFormat('id-ID').format(value);
    }

    getActivityStatus(movementType: string): string {
        // Map movement types to display labels
        const statusMap: { [key: string]: string } = {
            'inbound': 'Received',
            'outbound': 'Shipped',
            'production': 'Produced',
            'adjustment': 'Adjusted',
            'transfer': 'Transferred'
        };

        return statusMap[movementType.toLowerCase()] || movementType;
    }
}
