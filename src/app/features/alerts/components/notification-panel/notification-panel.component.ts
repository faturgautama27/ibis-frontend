import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { AlertService } from '../../services/alert.service';
import { Alert, AlertSeverity, AlertType } from '../../models/alert.model';
import { Subscription } from 'rxjs';

// Enhanced Components
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

/**
 * Notification Panel Component
 * Requirements: 18.6, 18.7, 18.8
 */
@Component({
    selector: 'app-notification-panel',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DrawerModule,
        ButtonModule,
        BadgeModule,
        SelectModule,
        TooltipModule,
        // Enhanced Components
        StatusBadgeComponent,
        EnhancedButtonComponent,
        EmptyStateComponent
    ],
    templateUrl: './notification-panel.component.html',
    styleUrls: ['./notification-panel.component.scss']
})
export class NotificationPanelComponent implements OnInit, OnDestroy {
    private alertService = inject(AlertService);

    visible = false;
    alerts: Alert[] = [];
    unreadCount = 0;
    selectedSeverity: AlertSeverity | null = null;

    severityOptions = [
        { label: 'Critical', value: AlertSeverity.CRITICAL },
        { label: 'Warning', value: AlertSeverity.WARNING },
        { label: 'Info', value: AlertSeverity.INFO }
    ];

    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.loadAlerts();

        // Subscribe to alerts updates
        this.subscriptions.push(
            this.alertService.alerts$.subscribe(() => {
                this.loadAlerts();
            })
        );

        // Subscribe to unread count
        this.subscriptions.push(
            this.alertService.unreadCount$.subscribe(count => {
                this.unreadCount = count;
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    togglePanel(): void {
        this.visible = !this.visible;
        if (this.visible) {
            this.loadAlerts();
        }
    }

    loadAlerts(): void {
        const filters: any = {};
        if (this.selectedSeverity) {
            filters.severity = this.selectedSeverity;
        }

        this.alertService.getAlerts(filters).subscribe(alerts => {
            this.alerts = alerts;
        });
    }

    markAsRead(alertId: string, event: Event): void {
        event.stopPropagation();
        this.alertService.markAsRead(alertId).subscribe(() => {
            this.loadAlerts();
        });
    }

    markAllAsRead(): void {
        this.alertService.markAllAsRead().subscribe(() => {
            this.loadAlerts();
        });
    }

    deleteAlert(alertId: string, event: Event): void {
        event.stopPropagation();
        this.alertService.deleteAlert(alertId).subscribe(() => {
            this.loadAlerts();
        });
    }

    clearOldAlerts(): void {
        this.alertService.clearOldAlerts(30).subscribe(() => {
            this.loadAlerts();
        });
    }

    handleAlertClick(alert: Alert): void {
        if (!alert.is_read) {
            this.markAsRead(alert.id, new Event('click'));
        }

        // Navigate to action URL if available
        if (alert.action_url) {
            console.log('Navigate to:', alert.action_url);
        }
    }

    getAlertIcon(type: AlertType): string {
        const iconMap: Record<AlertType, string> = {
            [AlertType.LOW_STOCK]: 'pi pi-exclamation-triangle',
            [AlertType.OUT_OF_STOCK]: 'pi pi-times-circle',
            [AlertType.EXPIRING_SOON]: 'pi pi-calendar-times',
            [AlertType.EXPIRED]: 'pi pi-ban',
            [AlertType.LICENSE_EXPIRY]: 'pi pi-id-card',
            [AlertType.PENDING_APPROVAL]: 'pi pi-clock',
            [AlertType.SYNC_FAILED]: 'pi pi-refresh',
            [AlertType.CEISA_REJECTED]: 'pi pi-times',
            [AlertType.SYSTEM]: 'pi pi-info-circle'
        };
        return iconMap[type] || 'pi pi-bell';
    }

    getSeverityColor(severity: AlertSeverity): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const colorMap: Record<AlertSeverity, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
            [AlertSeverity.CRITICAL]: 'danger',
            [AlertSeverity.WARNING]: 'warn',
            [AlertSeverity.INFO]: 'info'
        };
        return colorMap[severity] || 'info';
    }
}
