import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LucideIconData } from 'lucide-angular';
import * as lucideIcons from 'lucide-angular';

/**
 * MenuItem Interface
 * Represents a navigation menu item
 */
export interface MenuItem {
    id: string;
    label: string;
    icon: LucideIconData;
    route: string;
    badge?: number;
    children?: MenuItem[];
}

/**
 * NavigationService
 * Service untuk manage state sidebar dan navigation logic
 * Requirements: 9.1, 9.2, 9.4
 */
@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    /**
     * BehaviorSubject untuk sidebar toggle state
     * true = expanded, false = collapsed
     */
    toggleDashboardSidebar = new BehaviorSubject<boolean>(true);

    constructor() { }

    /**
     * Toggle sidebar state (expanded <-> collapsed)
     */
    toggleSidebar(): void {
        const current = this.toggleDashboardSidebar.value;
        this.toggleDashboardSidebar.next(!current);
    }

    /**
     * Collapse sidebar (set to collapsed state)
     */
    collapseSidebar(): void {
        this.toggleDashboardSidebar.next(false);
    }

    /**
     * Expand sidebar (set to expanded state)
     */
    expandSidebar(): void {
        this.toggleDashboardSidebar.next(true);
    }

    /**
     * Get menu items untuk sidebar navigation
     * Returns array of MenuItem
     */
    getMenuItems(): MenuItem[] {
        return [
            {
                id: 'dashboard',
                label: 'Dashboard',
                icon: lucideIcons.LayoutDashboard,
                route: '/dashboard'
            },
            {
                id: 'master-data',
                label: 'Master Data',
                icon: lucideIcons.Database,
                route: '#',
                children: [
                    {
                        id: 'inventory',
                        label: 'All Items',
                        icon: lucideIcons.Package,
                        route: '/inventory'
                    },
                    {
                        id: 'raw-materials',
                        label: 'Raw Materials',
                        icon: lucideIcons.Component,
                        route: '/items/raw-materials'
                    },
                    {
                        id: 'finished-goods',
                        label: 'Finished Goods',
                        icon: lucideIcons.PackageCheck,
                        route: '/items/finished-goods'
                    },
                    {
                        id: 'warehouse',
                        label: 'Warehouse',
                        icon: lucideIcons.Warehouse,
                        route: '/warehouses'
                    },
                    {
                        id: 'suppliers',
                        label: 'Suppliers',
                        icon: lucideIcons.Truck,
                        route: '/suppliers'
                    },
                    {
                        id: 'customers',
                        label: 'Customers',
                        icon: lucideIcons.Building2,
                        route: '/customers'
                    },
                    {
                        id: 'bc-documents',
                        label: 'BC Documents',
                        icon: lucideIcons.FileText,
                        route: '/bc-documents'
                    },
                    {
                        id: 'users',
                        label: 'Users',
                        icon: lucideIcons.Users,
                        route: '/users'
                    }
                ]
            },
            {
                id: 'purchase-orders',
                label: 'Purchase Orders',
                icon: lucideIcons.ShoppingCart,
                route: '/purchase-orders'
            },
            {
                id: 'inbound',
                label: 'Inbound',
                icon: lucideIcons.PackageCheck,
                route: '/inbound'
            },
            {
                id: 'sales-orders',
                label: 'Sales Orders',
                icon: lucideIcons.ShoppingBag,
                route: '/sales-orders'
            },
            {
                id: 'outbound',
                label: 'Outbound',
                icon: lucideIcons.PackageOpen,
                route: '/outbound'
            },
            {
                id: 'production',
                label: 'Production',
                icon: lucideIcons.Factory,
                route: '/production'
            },
            {
                id: 'stock',
                label: 'Stock',
                icon: lucideIcons.Boxes,
                route: '#',
                children: [
                    {
                        id: 'stock-adjustment',
                        label: 'Stock Adjustment',
                        icon: lucideIcons.Settings,
                        route: '/stock-adjustment'
                    },
                    {
                        id: 'stock-mutation',
                        label: 'Stock Mutation',
                        icon: lucideIcons.ArrowRightLeft,
                        route: '/stock-mutation'
                    },
                    {
                        id: 'stock-opname',
                        label: 'Stock Opname',
                        icon: lucideIcons.ClipboardList,
                        route: '/stock-opname'
                    },
                    {
                        id: 'stock-balance',
                        label: 'Stock Balance',
                        icon: lucideIcons.TrendingUp,
                        route: '/stock-balance'
                    }
                ]
            },
            {
                id: 'traceability',
                label: 'Traceability',
                icon: lucideIcons.GitBranch,
                route: '/traceability'
            },
            {
                id: 'customs-sync',
                label: 'Customs Sync',
                icon: lucideIcons.RefreshCw,
                route: '/customs-integration'
            },
            {
                id: 'reports',
                label: 'Reports',
                icon: lucideIcons.BarChart3,
                route: '#',
                children: [
                    {
                        id: 'report-inbound',
                        label: 'Inbound Report',
                        icon: lucideIcons.FileBarChart,
                        route: '/reports/inbound'
                    },
                    {
                        id: 'report-outbound',
                        label: 'Outbound Report',
                        icon: lucideIcons.FileBarChart,
                        route: '/reports/outbound'
                    },
                    {
                        id: 'report-purchase-order',
                        label: 'Purchase Order Report',
                        icon: lucideIcons.FileBarChart,
                        route: '/reports/purchase-orders'
                    },
                    {
                        id: 'report-sales-order',
                        label: 'Sales Order Report',
                        icon: lucideIcons.FileBarChart,
                        route: '/reports/sales-orders'
                    },
                    {
                        id: 'report-stock-opname',
                        label: 'Stock Opname Report',
                        icon: lucideIcons.FileBarChart,
                        route: '/reports/stock-opname'
                    },
                    {
                        id: 'report-stock-adjustment',
                        label: 'Stock Adjustment Report',
                        icon: lucideIcons.FileBarChart,
                        route: '/reports/stock-adjustment'
                    },
                    {
                        id: 'report-all',
                        label: 'All Reports',
                        icon: lucideIcons.FileText,
                        route: '/reports'
                    }
                ]
            },
            {
                id: 'audit-trail',
                label: 'Audit Trail',
                icon: lucideIcons.History,
                route: '/audit-trail'
            },
            {
                id: 'import-export',
                label: 'Import/Export',
                icon: lucideIcons.Upload,
                route: '/import-export'
            }
        ];
    }
}
