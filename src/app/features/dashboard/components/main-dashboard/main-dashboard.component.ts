import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { DashboardService, DashboardMetrics } from '../../services/dashboard.service';
import { interval, Subscription, of } from 'rxjs';
import { switchMap, delay } from 'rxjs/operators';

/**
 * Main Dashboard Component - Enhanced Version
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
        ProgressBarModule
    ],
    styles: [`
        :host {
            display: block;
            animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .metric-card {
            animation: slideInUp 0.6s ease-out;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .metric-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .metric-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end));
        }

        .metric-card.blue::before {
            --gradient-start: #3b82f6;
            --gradient-end: #60a5fa;
        }

        .metric-card.green::before {
            --gradient-start: #10b981;
            --gradient-end: #34d399;
        }

        .metric-card.yellow::before {
            --gradient-start: #f59e0b;
            --gradient-end: #fbbf24;
        }

        .metric-card.red::before {
            --gradient-start: #ef4444;
            --gradient-end: #f87171;
        }

        .metric-card.purple::before {
            --gradient-start: #8b5cf6;
            --gradient-end: #a78bfa;
        }

        .metric-card.indigo::before {
            --gradient-start: #6366f1;
            --gradient-end: #818cf8;
        }

        .icon-wrapper {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .metric-card:hover .icon-wrapper {
            transform: rotate(5deg) scale(1.1);
        }

        .chart-card {
            animation: slideInUp 0.8s ease-out;
            transition: all 0.3s ease;
        }

        .chart-card:hover {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .activity-item {
            transition: all 0.2s ease;
            border-left: 3px solid transparent;
        }

        .activity-item:hover {
            background-color: #f9fafb;
            border-left-color: #3b82f6;
            transform: translateX(5px);
        }

        .refresh-indicator {
            animation: slideInUp 1s ease-out;
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.9);
        }

        .trend-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .trend-up {
            background-color: #d1fae5;
            color: #065f46;
        }

        .trend-down {
            background-color: #fee2e2;
            color: #991b1b;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            line-height: 1;
            background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .mini-chart {
            height: 40px;
            margin-top: 8px;
        }
    `],
    template: `
        <div class="main-layout">
            <!-- Header with Actions -->
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-4xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                    <p class="text-gray-600">Welcome back! Here's what's happening with your inventory today.</p>
                </div>
                <div class="flex gap-3">
                    <button pButton icon="pi pi-refresh" label="Refresh" 
                            class="p-button-outlined" (click)="loadDashboardData()"></button>
                    <button pButton icon="pi pi-download" label="Export" 
                            class="p-button-outlined"></button>
                </div>
            </div>

            <!-- Enhanced Metrics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <!-- Total Stock Value Card -->
                <div class="metric-card blue bg-white rounded-xl shadow-lg p-6">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-600 mb-2">Total Stock Value</p>
                            <p class="stat-number" style="--gradient-start: #3b82f6; --gradient-end: #60a5fa;">
                                {{ formatCurrency(metrics.total_stock_value) }}
                            </p>
                            <div class="trend-badge trend-up mt-3">
                                <i class="pi pi-arrow-up text-xs"></i>
                                <span>12.5% vs last month</span>
                            </div>
                        </div>
                        <div class="icon-wrapper" style="background: linear-gradient(135deg, #3b82f6, #60a5fa);">
                            <i class="pi pi-dollar text-2xl text-white"></i>
                        </div>
                    </div>
                    <div class="mini-chart">
                        <p-chart type="line" [data]="miniChartData.stockValue" 
                                 [options]="miniChartOptions" height="40px"></p-chart>
                    </div>
                </div>

                <!-- Total Items Card -->
                <div class="metric-card green bg-white rounded-xl shadow-lg p-6">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-600 mb-2">Total Items</p>
                            <p class="stat-number" style="--gradient-start: #10b981; --gradient-end: #34d399;">
                                {{ metrics.total_items | number }}
                            </p>
                            <div class="trend-badge trend-up mt-3">
                                <i class="pi pi-arrow-up text-xs"></i>
                                <span>8.2% vs last month</span>
                            </div>
                        </div>
                        <div class="icon-wrapper" style="background: linear-gradient(135deg, #10b981, #34d399);">
                            <i class="pi pi-box text-2xl text-white"></i>
                        </div>
                    </div>
                    <div class="mini-chart">
                        <p-chart type="line" [data]="miniChartData.totalItems" 
                                 [options]="miniChartOptions" height="40px"></p-chart>
                    </div>
                </div>

                <!-- Warehouse Utilization Card -->
                <div class="metric-card purple bg-white rounded-xl shadow-lg p-6">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-600 mb-2">Avg. Warehouse Utilization</p>
                            <p class="stat-number" style="--gradient-start: #8b5cf6; --gradient-end: #a78bfa;">
                                {{ metrics.avg_utilization }}%
                            </p>
                            <div class="trend-badge trend-up mt-3">
                                <i class="pi pi-arrow-up text-xs"></i>
                                <span>5.3% vs last month</span>
                            </div>
                        </div>
                        <div class="icon-wrapper" style="background: linear-gradient(135deg, #8b5cf6, #a78bfa);">
                            <i class="pi pi-building text-2xl text-white"></i>
                        </div>
                    </div>
                    <p-progressBar [value]="metrics.avg_utilization" 
                                   [showValue]="false"
                                   styleClass="h-2"></p-progressBar>
                </div>
            </div>

            <!-- Alert Cards Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="metric-card yellow bg-white rounded-xl shadow-md p-5">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-gray-600 mb-1">Low Stock Alerts</p>
                            <p class="text-3xl font-bold text-yellow-600">{{ metrics.low_stock_count }}</p>
                        </div>
                        <div class="icon-wrapper" style="background: rgba(245, 158, 11, 0.1);">
                            <i class="pi pi-exclamation-triangle text-xl text-yellow-600"></i>
                        </div>
                    </div>
                </div>

                <div class="metric-card red bg-white rounded-xl shadow-md p-5">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-gray-600 mb-1">Expiring Soon</p>
                            <p class="text-3xl font-bold text-red-600">{{ metrics.expiring_items_count }}</p>
                        </div>
                        <div class="icon-wrapper" style="background: rgba(239, 68, 68, 0.1);">
                            <i class="pi pi-calendar-times text-xl text-red-600"></i>
                        </div>
                    </div>
                </div>

                <div class="metric-card blue bg-white rounded-xl shadow-md p-5">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-gray-600 mb-1">Pending Inbound</p>
                            <p class="text-3xl font-bold text-blue-600">{{ metrics.pending_inbound }}</p>
                        </div>
                        <div class="icon-wrapper" style="background: rgba(59, 130, 246, 0.1);">
                            <i class="pi pi-arrow-down text-xl text-blue-600"></i>
                        </div>
                    </div>
                </div>

                <div class="metric-card indigo bg-white rounded-xl shadow-md p-5">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-gray-600 mb-1">Pending Outbound</p>
                            <p class="text-3xl font-bold text-indigo-600">{{ metrics.pending_outbound }}</p>
                        </div>
                        <div class="icon-wrapper" style="background: rgba(99, 102, 241, 0.1);">
                            <i class="pi pi-arrow-up text-xl text-indigo-600"></i>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Enhanced Charts Row -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <!-- Stock Movement Trends -->
                <div class="chart-card bg-white rounded-xl shadow-lg p-6">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">Stock Movement Trends</h3>
                            <p class="text-sm text-gray-600 mt-1">Last 30 days activity</p>
                        </div>
                        <div class="flex gap-2">
                            <button pButton icon="pi pi-calendar" class="p-button-text p-button-sm"></button>
                            <button pButton icon="pi pi-ellipsis-v" class="p-button-text p-button-sm"></button>
                        </div>
                    </div>
                    <div style="height: 300px;">
                        <p-chart type="line" [data]="movementChartData" 
                                 [options]="enhancedChartOptions" height="300px"></p-chart>
                    </div>
                </div>

                <!-- Category Distribution -->
                <div class="chart-card bg-white rounded-xl shadow-lg p-6">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">Stock by Category</h3>
                            <p class="text-sm text-gray-600 mt-1">Current distribution</p>
                        </div>
                        <div class="flex gap-2">
                            <button pButton icon="pi pi-chart-pie" class="p-button-text p-button-sm"></button>
                            <button pButton icon="pi pi-ellipsis-v" class="p-button-text p-button-sm"></button>
                        </div>
                    </div>
                    <div style="height: 300px;">
                        <p-chart type="doughnut" [data]="categoryChartData" 
                                 [options]="doughnutChartOptions" height="300px"></p-chart>
                    </div>
                </div>
            </div>

            <!-- Warehouse Utilization & Production Efficiency -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <!-- Warehouse Utilization -->
                <div class="chart-card bg-white rounded-xl shadow-lg p-6">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">Warehouse Utilization</h3>
                            <p class="text-sm text-gray-600 mt-1">Capacity usage by location</p>
                        </div>
                    </div>
                    <div style="height: 300px;">
                        <p-chart type="bar" [data]="utilizationChartData" 
                                 [options]="barChartOptions" height="300px"></p-chart>
                    </div>
                </div>

                <!-- Production Efficiency -->
                <div class="chart-card bg-white rounded-xl shadow-lg p-6">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">Production Efficiency</h3>
                            <p class="text-sm text-gray-600 mt-1">Last 6 months performance</p>
                        </div>
                    </div>
                    <div style="height: 300px;">
                        <p-chart type="bar" [data]="efficiencyChartData" 
                                 [options]="barChartOptions" height="300px"></p-chart>
                    </div>
                </div>
            </div>

            <!-- Bottom Row: Activities & Top Products -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <!-- Recent Activities -->
                <div class="chart-card bg-white rounded-xl shadow-lg p-6">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">Recent Activities</h3>
                            <p class="text-sm text-gray-600 mt-1">Latest inventory movements</p>
                        </div>
                        <button pButton label="View All" class="p-button-text p-button-sm"></button>
                    </div>
                    <div class="space-y-1 max-h-80 overflow-y-auto">
                        <div *ngFor="let activity of recentActivities" 
                             class="activity-item flex items-start gap-4 p-4 rounded-lg">
                            <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                                 [ngClass]="{
                                     'bg-green-100': activity.movement_type === 'INBOUND',
                                     'bg-red-100': activity.movement_type === 'OUTBOUND',
                                     'bg-blue-100': activity.movement_type === 'PRODUCTION'
                                 }">
                                <i class="pi text-sm"
                                   [ngClass]="{
                                       'pi-arrow-down text-green-600': activity.movement_type === 'INBOUND',
                                       'pi-arrow-up text-red-600': activity.movement_type === 'OUTBOUND',
                                       'pi-cog text-blue-600': activity.movement_type === 'PRODUCTION'
                                   }"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-semibold text-gray-900">{{ activity.movement_type }}</p>
                                <p class="text-sm text-gray-600 truncate">
                                    {{ activity.item_name }} - 
                                    <span class="font-medium">{{ activity.quantity_change }}</span> {{ activity.unit }}
                                </p>
                                <p class="text-xs text-gray-500 mt-1">{{ activity.movement_date | date:'medium' }}</p>
                            </div>
                            <div class="flex-shrink-0">
                                <span class="text-xs font-medium px-2 py-1 rounded-full"
                                      [ngClass]="{
                                          'bg-green-100 text-green-700': activity.movement_type === 'INBOUND',
                                          'bg-red-100 text-red-700': activity.movement_type === 'OUTBOUND',
                                          'bg-blue-100 text-blue-700': activity.movement_type === 'PRODUCTION'
                                      }">
                                    {{ activity.status }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Products -->
                <div class="chart-card bg-white rounded-xl shadow-lg p-6">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">Top Moving Products</h3>
                            <p class="text-sm text-gray-600 mt-1">Most active items this month</p>
                        </div>
                        <button pButton label="View All" class="p-button-text p-button-sm"></button>
                    </div>
                    <div class="space-y-4">
                        <div *ngFor="let product of topProducts; let i = index" 
                             class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-all">
                            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                {{ i + 1 }}
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-semibold text-gray-900 truncate">{{ product.name }}</p>
                                <p class="text-xs text-gray-600">{{ product.category }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-bold text-gray-900">{{ product.movements }}</p>
                                <p class="text-xs text-gray-600">movements</p>
                            </div>
                            <div class="flex-shrink-0">
                                <p-progressBar [value]="product.percentage" 
                                               [showValue]="false"
                                               styleClass="w-20 h-2"></p-progressBar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Auto-refresh indicator -->
            <div class="refresh-indicator fixed bottom-6 right-6 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3 border border-gray-200">
                <i class="pi pi-sync text-blue-600" [class.pi-spin]="isRefreshing"></i>
                <div>
                    <p class="text-xs font-medium text-gray-900">Auto-refresh</p>
                    <p class="text-xs text-gray-600">{{ countdown }}s</p>
                </div>
            </div>
        </div>
    `
})
export class MainDashboardComponent implements OnInit, OnDestroy {
    private dashboardService = inject(DashboardService);
    private refreshSubscription?: Subscription;
    private countdownSubscription?: Subscription;

    // Enhanced metrics with mock data
    metrics: DashboardMetrics & { avg_utilization: number } = {
        total_stock_value: 2450000000, // 2.45 Billion IDR
        total_items: 15847,
        total_warehouses: 8,
        low_stock_count: 23,
        expiring_items_count: 12,
        pending_inbound: 45,
        pending_outbound: 67,
        pending_production: 34,
        avg_utilization: 78
    };

    // Mock data for activities
    recentActivities: any[] = [
        {
            movement_type: 'INBOUND',
            item_name: 'Raw Material Steel A36',
            quantity_change: 500,
            unit: 'kg',
            movement_date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            status: 'Completed'
        },
        {
            movement_type: 'OUTBOUND',
            item_name: 'Finished Product Widget X1',
            quantity_change: 150,
            unit: 'pcs',
            movement_date: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            status: 'In Progress'
        },
        {
            movement_type: 'PRODUCTION',
            item_name: 'Assembly Component B2',
            quantity_change: 200,
            unit: 'units',
            movement_date: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            status: 'Completed'
        },
        {
            movement_type: 'INBOUND',
            item_name: 'Electronic Components Pack',
            quantity_change: 1000,
            unit: 'pcs',
            movement_date: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
            status: 'Completed'
        },
        {
            movement_type: 'OUTBOUND',
            item_name: 'Packaging Materials',
            quantity_change: 300,
            unit: 'boxes',
            movement_date: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
            status: 'Pending'
        }
    ];

    // Mock data for top products
    topProducts: any[] = [
        { name: 'Steel Rods Grade A', category: 'Raw Materials', movements: 245, percentage: 100 },
        { name: 'Electronic Circuit Boards', category: 'Components', movements: 198, percentage: 81 },
        { name: 'Plastic Housing Units', category: 'Components', movements: 167, percentage: 68 },
        { name: 'Assembly Screws M6', category: 'Hardware', movements: 134, percentage: 55 },
        { name: 'Rubber Gaskets', category: 'Sealing', movements: 89, percentage: 36 }
    ];

    countdown = 300; // 5 minutes
    isRefreshing = false;

    // Chart data
    movementChartData: any;
    utilizationChartData: any;
    efficiencyChartData: any;
    categoryChartData: any;
    miniChartData: any = {};

    // Chart options
    enhancedChartOptions: any;
    barChartOptions: any;
    doughnutChartOptions: any;
    miniChartOptions: any;

    ngOnInit(): void {
        this.initChartOptions();
        this.loadMockData();
        this.startAutoRefresh();
    }

    ngOnDestroy(): void {
        this.refreshSubscription?.unsubscribe();
        this.countdownSubscription?.unsubscribe();
    }

    loadDashboardData(): void {
        this.isRefreshing = true;

        // Simulate API call delay
        setTimeout(() => {
            this.loadMockData();
            this.isRefreshing = false;
        }, 1500);
    }

    loadMockData(): void {
        // Mock stock movement trends (30 days)
        const dates = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
        });

        this.movementChartData = {
            labels: dates,
            datasets: [
                {
                    label: 'Inbound',
                    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 50),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Outbound',
                    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 80) + 40),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Production',
                    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 60) + 30),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        };

        // Mock warehouse utilization
        this.utilizationChartData = {
            labels: ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Warehouse D', 'Warehouse E'],
            datasets: [
                {
                    label: 'Utilization %',
                    data: [85, 72, 91, 68, 79],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderRadius: 8
                }
            ]
        };

        // Mock production efficiency (6 months)
        this.efficiencyChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Efficiency %',
                    data: [88, 92, 87, 94, 89, 91],
                    backgroundColor: '#10b981',
                    borderRadius: 8
                },
                {
                    label: 'Scrap %',
                    data: [12, 8, 13, 6, 11, 9],
                    backgroundColor: '#ef4444',
                    borderRadius: 8
                }
            ]
        };

        // Mock category distribution
        this.categoryChartData = {
            labels: ['Raw Materials', 'Components', 'Finished Goods', 'Packaging', 'Tools'],
            datasets: [
                {
                    data: [35, 28, 20, 12, 5],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 0
                }
            ]
        };

        // Mini chart data for metric cards
        this.miniChartData = {
            stockValue: {
                labels: ['', '', '', '', '', '', ''],
                datasets: [{
                    data: [2.1, 2.3, 2.2, 2.4, 2.35, 2.42, 2.45],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    pointRadius: 0,
                    fill: true
                }]
            },
            totalItems: {
                labels: ['', '', '', '', '', '', ''],
                datasets: [{
                    data: [14200, 14800, 15100, 15400, 15600, 15750, 15847],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    pointRadius: 0,
                    fill: true
                }]
            }
        };
    }

    startAutoRefresh(): void {
        // Refresh every 5 minutes
        this.refreshSubscription = interval(300000).pipe(
            switchMap(() => {
                this.loadDashboardData();
                return of(null);
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
        // Enhanced chart options with better styling
        this.enhancedChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        };

        // Bar chart options
        this.barChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        };

        // Doughnut chart options
        this.doughnutChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            cutout: '60%'
        };

        // Mini chart options
        this.miniChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        };
    }

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }
}