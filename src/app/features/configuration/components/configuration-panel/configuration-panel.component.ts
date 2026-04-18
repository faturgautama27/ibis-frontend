import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { PasswordModule } from 'primeng/password';
import { LucideAngularModule, Settings, Save, Download, RotateCcw } from 'lucide-angular';
import { ConfigurationService } from '../../services/configuration.service';
import { Configuration, KawasanType, OperationMode } from '../../models/configuration.model';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';
import { EnhancedFormFieldComponent } from '../../../../shared/components/enhanced-form-field/enhanced-form-field.component';

/**
 * Configuration Panel Component
 * Requirements: 20.1-20.9
 */
@Component({
    selector: 'app-configuration-panel',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TabsModule,
        InputTextModule,
        InputNumberModule,
        SelectModule,
        CheckboxModule,
        ButtonModule,
        DatePickerModule,
        PasswordModule,
        LucideAngularModule,
        // Enhanced Components
        PageHeaderComponent,
        EnhancedCardComponent,
        EnhancedButtonComponent,
        EnhancedFormFieldComponent
    ],
    template: `
        <!-- Enhanced Page Header -->
        <app-page-header
            title="System Configuration"
            subtitle="Configure system settings and integrations"
            icon="pi pi-cog"
            [breadcrumbs]="breadcrumbs">
        </app-page-header>

        <!-- Main Content -->
        <div class="p-6 space-y-6 bg-gray-50 min-h-screen">

            <!-- Configuration Card -->
            <app-enhanced-card 
                variant="standard"
                title="Configuration Settings"
                subtitle="Manage your system configuration across different categories"
                [header]="true"
                [footer]="true"
                customClass="shadow-lg">
                
                <p-tabs styleClass="enhanced-tabs">
                    <!-- Company Info Tab -->
                    <p-tabpanel header="Company Information">
                        <div class="space-y-6 py-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <app-enhanced-form-field
                                    type="text"
                                    label="Company Name"
                                    placeholder="Enter company name"
                                    [required]="true"
                                    [(ngModel)]="config.company_info.company_name">
                                </app-enhanced-form-field>
                                
                                <app-enhanced-form-field
                                    type="text"
                                    label="NPWP"
                                    placeholder="Enter NPWP number"
                                    [required]="true"
                                    [(ngModel)]="config.company_info.npwp">
                                </app-enhanced-form-field>
                            </div>

                            <app-enhanced-form-field
                                type="textarea"
                                label="Company Address"
                                placeholder="Enter complete company address"
                                [rows]="3"
                                [(ngModel)]="config.company_info.company_address">
                            </app-enhanced-form-field>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <app-enhanced-form-field
                                    type="text"
                                    label="Phone Number"
                                    placeholder="Enter phone number"
                                    icon="pi pi-phone"
                                    [(ngModel)]="config.company_info.company_phone">
                                </app-enhanced-form-field>
                                
                                <app-enhanced-form-field
                                    type="email"
                                    label="Email Address"
                                    placeholder="Enter email address"
                                    icon="pi pi-envelope"
                                    [(ngModel)]="config.company_info.company_email">
                                </app-enhanced-form-field>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <app-enhanced-form-field
                                    type="dropdown"
                                    label="Kawasan Type"
                                    placeholder="Select kawasan type"
                                    [required]="true"
                                    [options]="kawasanTypes"
                                    optionLabel="label"
                                    optionValue="value"
                                    [(ngModel)]="config.company_info.kawasan_type">
                                </app-enhanced-form-field>
                                
                                <app-enhanced-form-field
                                    type="text"
                                    label="License Number"
                                    placeholder="Enter license number"
                                    [(ngModel)]="config.company_info.kawasan_license_number">
                                </app-enhanced-form-field>
                                
                                <app-enhanced-form-field
                                    type="date"
                                    label="License Expiry"
                                    placeholder="Select expiry date"
                                    [(ngModel)]="config.company_info.kawasan_license_expiry">
                                </app-enhanced-form-field>
                            </div>
                        </div>
                    </p-tabpanel>

                    <!-- System Settings Tab -->
                    <p-tabpanel header="System Settings">
                        <div class="space-y-6 py-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <app-enhanced-form-field
                                    type="dropdown"
                                    label="Operation Mode"
                                    placeholder="Select operation mode"
                                    [options]="operationModes"
                                    optionLabel="label"
                                    optionValue="value"
                                    helpText="Choose between demo and production mode"
                                    [(ngModel)]="config.system.operation_mode">
                                </app-enhanced-form-field>
                                
                                <app-enhanced-form-field
                                    type="number"
                                    label="Session Timeout (minutes)"
                                    placeholder="Enter timeout in minutes"
                                    [min]="5"
                                    [max]="480"
                                    helpText="Session will expire after this duration of inactivity"
                                    [(ngModel)]="config.system.session_timeout_minutes">
                                </app-enhanced-form-field>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <app-enhanced-form-field
                                    type="number"
                                    label="Low Stock Threshold"
                                    placeholder="Enter threshold value"
                                    [min]="0"
                                    helpText="Alert when stock falls below this level"
                                    [(ngModel)]="config.system.low_stock_threshold">
                                </app-enhanced-form-field>
                                
                                <app-enhanced-form-field
                                    type="number"
                                    label="Expiry Warning (days)"
                                    placeholder="Enter warning days"
                                    [min]="1"
                                    [max]="365"
                                    helpText="Alert when items expire within this timeframe"
                                    [(ngModel)]="config.system.expiry_warning_days">
                                </app-enhanced-form-field>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <app-enhanced-form-field
                                    type="dropdown"
                                    label="Language"
                                    placeholder="Select language"
                                    [options]="languages"
                                    optionLabel="label"
                                    optionValue="value"
                                    [(ngModel)]="config.system.language">
                                </app-enhanced-form-field>
                                
                                <app-enhanced-form-field
                                    type="dropdown"
                                    label="Currency"
                                    placeholder="Select currency"
                                    [options]="currencies"
                                    optionLabel="label"
                                    optionValue="value"
                                    [(ngModel)]="config.system.currency">
                                </app-enhanced-form-field>
                            </div>

                            <app-enhanced-form-field
                                type="checkbox"
                                checkboxLabel="Enable Auto Backup"
                                helpText="Automatically backup system data at regular intervals"
                                [(ngModel)]="config.system.auto_backup_enabled">
                            </app-enhanced-form-field>
                        </div>
                    </p-tabpanel>

                    <!-- API Configuration Tab -->
                    <p-tabpanel header="API Configuration">
                        <div class="space-y-8 py-6">
                            <!-- IT Inventory Integration -->
                            <app-enhanced-card 
                                variant="standard"
                                title="IT Inventory Integration"
                                subtitle="Configure integration with IT Inventory system"
                                [header]="true"
                                customClass="border-2 border-blue-100 bg-blue-50/30">
                                
                                <div class="space-y-4">
                                    <app-enhanced-form-field
                                        type="checkbox"
                                        checkboxLabel="Enable IT Inventory Integration"
                                        helpText="Connect to external IT Inventory system for data synchronization"
                                        [(ngModel)]="config.api.it_inventory_enabled">
                                    </app-enhanced-form-field>

                                    <div *ngIf="config.api.it_inventory_enabled" class="space-y-4 pl-6 border-l-4 border-blue-200">
                                        <app-enhanced-form-field
                                            type="text"
                                            label="API URL"
                                            placeholder="https://api.itinventory.com"
                                            icon="pi pi-link"
                                            [(ngModel)]="config.api.it_inventory_url">
                                        </app-enhanced-form-field>
                                        
                                        <app-enhanced-form-field
                                            type="password"
                                            label="API Key"
                                            placeholder="Enter API key"
                                            icon="pi pi-key"
                                            helpText="Keep this secure and do not share"
                                            [(ngModel)]="config.api.it_inventory_api_key">
                                        </app-enhanced-form-field>
                                        
                                        <app-enhanced-form-field
                                            type="number"
                                            label="Timeout (seconds)"
                                            placeholder="Enter timeout"
                                            [min]="5"
                                            [max]="300"
                                            [(ngModel)]="config.api.it_inventory_timeout_seconds">
                                        </app-enhanced-form-field>
                                    </div>
                                </div>
                            </app-enhanced-card>

                            <!-- CEISA Integration -->
                            <app-enhanced-card 
                                variant="standard"
                                title="CEISA Integration"
                                subtitle="Configure integration with CEISA customs system"
                                [header]="true"
                                customClass="border-2 border-green-100 bg-green-50/30">
                                
                                <div class="space-y-4">
                                    <app-enhanced-form-field
                                        type="checkbox"
                                        checkboxLabel="Enable CEISA Integration"
                                        helpText="Connect to CEISA for customs documentation and compliance"
                                        [(ngModel)]="config.api.ceisa_enabled">
                                    </app-enhanced-form-field>

                                    <div *ngIf="config.api.ceisa_enabled" class="space-y-4 pl-6 border-l-4 border-green-200">
                                        <app-enhanced-form-field
                                            type="text"
                                            label="API URL"
                                            placeholder="https://api.ceisa.go.id"
                                            icon="pi pi-link"
                                            [(ngModel)]="config.api.ceisa_url">
                                        </app-enhanced-form-field>
                                        
                                        <app-enhanced-form-field
                                            type="password"
                                            label="API Key"
                                            placeholder="Enter API key"
                                            icon="pi pi-key"
                                            helpText="Official CEISA API credentials"
                                            [(ngModel)]="config.api.ceisa_api_key">
                                        </app-enhanced-form-field>
                                        
                                        <app-enhanced-form-field
                                            type="number"
                                            label="Timeout (seconds)"
                                            placeholder="Enter timeout"
                                            [min]="5"
                                            [max]="300"
                                            [(ngModel)]="config.api.ceisa_timeout_seconds">
                                        </app-enhanced-form-field>
                                    </div>
                                </div>
                            </app-enhanced-card>

                            <!-- Sync Settings -->
                            <app-enhanced-card 
                                variant="standard"
                                title="Synchronization Settings"
                                subtitle="Configure retry and synchronization parameters"
                                [header]="true"
                                customClass="border-2 border-purple-100 bg-purple-50/30">
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <app-enhanced-form-field
                                        type="number"
                                        label="Retry Attempts"
                                        placeholder="Enter retry count"
                                        [min]="1"
                                        [max]="10"
                                        helpText="Number of retry attempts for failed API calls"
                                        [(ngModel)]="config.api.sync_retry_attempts">
                                    </app-enhanced-form-field>
                                    
                                    <app-enhanced-form-field
                                        type="number"
                                        label="Retry Delay (seconds)"
                                        placeholder="Enter delay"
                                        [min]="1"
                                        [max]="60"
                                        helpText="Delay between retry attempts"
                                        [(ngModel)]="config.api.sync_retry_delay_seconds">
                                    </app-enhanced-form-field>
                                </div>
                            </app-enhanced-card>
                        </div>
                    </p-tabpanel>

                    <!-- Alert Configuration Tab -->
                    <p-tabpanel header="Alerts & Notifications">
                        <div class="space-y-8 py-6">
                            <!-- System Alerts -->
                            <app-enhanced-card 
                                variant="standard"
                                title="System Alerts"
                                subtitle="Configure system-wide alert preferences"
                                [header]="true"
                                customClass="border-2 border-yellow-100 bg-yellow-50/30">
                                
                                <div class="space-y-4">
                                    <app-enhanced-form-field
                                        type="checkbox"
                                        checkboxLabel="Enable Sound Notifications"
                                        helpText="Play sound alerts for important notifications"
                                        [(ngModel)]="config.alerts.sound_notifications_enabled">
                                    </app-enhanced-form-field>

                                    <app-enhanced-form-field
                                        type="checkbox"
                                        checkboxLabel="Low Stock Alerts"
                                        helpText="Receive alerts when inventory falls below threshold"
                                        [(ngModel)]="config.alerts.low_stock_alert_enabled">
                                    </app-enhanced-form-field>

                                    <app-enhanced-form-field
                                        type="checkbox"
                                        checkboxLabel="Expiry Alerts"
                                        helpText="Receive alerts for items approaching expiry"
                                        [(ngModel)]="config.alerts.expiry_alert_enabled">
                                    </app-enhanced-form-field>

                                    <app-enhanced-form-field
                                        type="checkbox"
                                        checkboxLabel="License Expiry Alerts"
                                        helpText="Receive alerts for license renewals"
                                        [(ngModel)]="config.alerts.license_expiry_alert_enabled">
                                    </app-enhanced-form-field>

                                    <app-enhanced-form-field
                                        type="checkbox"
                                        checkboxLabel="Sync Failure Alerts"
                                        helpText="Receive alerts when API synchronization fails"
                                        [(ngModel)]="config.alerts.sync_failure_alert_enabled">
                                    </app-enhanced-form-field>
                                </div>
                            </app-enhanced-card>

                            <!-- Email Notifications -->
                            <app-enhanced-card 
                                variant="standard"
                                title="Email Notifications"
                                subtitle="Configure SMTP settings for email alerts"
                                [header]="true"
                                customClass="border-2 border-indigo-100 bg-indigo-50/30">
                                
                                <div class="space-y-4">
                                    <app-enhanced-form-field
                                        type="checkbox"
                                        checkboxLabel="Enable Email Notifications"
                                        helpText="Send email notifications for important alerts"
                                        [(ngModel)]="config.alerts.email_notifications_enabled">
                                    </app-enhanced-form-field>

                                    <div *ngIf="config.alerts.email_notifications_enabled" class="space-y-4 pl-6 border-l-4 border-indigo-200">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <app-enhanced-form-field
                                                type="text"
                                                label="SMTP Host"
                                                placeholder="smtp.gmail.com"
                                                icon="pi pi-server"
                                                [(ngModel)]="config.alerts.smtp_host">
                                            </app-enhanced-form-field>
                                            
                                            <app-enhanced-form-field
                                                type="number"
                                                label="SMTP Port"
                                                placeholder="587"
                                                [min]="1"
                                                [max]="65535"
                                                [(ngModel)]="config.alerts.smtp_port">
                                            </app-enhanced-form-field>
                                        </div>
                                        
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <app-enhanced-form-field
                                                type="text"
                                                label="Username"
                                                placeholder="your-email@domain.com"
                                                icon="pi pi-user"
                                                [(ngModel)]="config.alerts.smtp_username">
                                            </app-enhanced-form-field>
                                            
                                            <app-enhanced-form-field
                                                type="password"
                                                label="Password"
                                                placeholder="Enter SMTP password"
                                                icon="pi pi-lock"
                                                [(ngModel)]="config.alerts.smtp_password">
                                            </app-enhanced-form-field>
                                        </div>
                                        
                                        <app-enhanced-form-field
                                            type="email"
                                            label="From Email"
                                            placeholder="noreply@yourcompany.com"
                                            icon="pi pi-envelope"
                                            helpText="Email address used as sender for notifications"
                                            [(ngModel)]="config.alerts.smtp_from_email">
                                        </app-enhanced-form-field>
                                    </div>
                                </div>
                            </app-enhanced-card>
                        </div>
                    </p-tabpanel>

                    <!-- Report Configuration Tab -->
                    <p-tabpanel header="Reports">
                        <div class="space-y-6 py-6">
                            <app-enhanced-card 
                                variant="standard"
                                title="Report Settings"
                                subtitle="Configure default report generation preferences"
                                [header]="true"
                                customClass="border-2 border-teal-100 bg-teal-50/30">
                                
                                <div class="space-y-6">
                                    <app-enhanced-form-field
                                        type="dropdown"
                                        label="Default Report Format"
                                        placeholder="Select format"
                                        [options]="reportFormats"
                                        optionLabel="label"
                                        optionValue="value"
                                        helpText="Default format for generated reports"
                                        [(ngModel)]="config.reports.default_report_format">
                                    </app-enhanced-form-field>

                                    <app-enhanced-form-field
                                        type="text"
                                        label="Report Logo URL"
                                        placeholder="https://yourcompany.com/logo.png"
                                        icon="pi pi-image"
                                        helpText="Logo displayed on generated reports"
                                        [(ngModel)]="config.reports.report_logo_url">
                                    </app-enhanced-form-field>

                                    <app-enhanced-form-field
                                        type="text"
                                        label="Report Footer Text"
                                        placeholder="© 2024 Your Company Name. All rights reserved."
                                        helpText="Footer text displayed on all reports"
                                        [(ngModel)]="config.reports.report_footer_text">
                                    </app-enhanced-form-field>

                                    <app-enhanced-form-field
                                        type="number"
                                        label="Report Retention (days)"
                                        placeholder="Enter retention period"
                                        [min]="1"
                                        [max]="365"
                                        helpText="How long to keep generated reports before deletion"
                                        [(ngModel)]="config.reports.report_retention_days">
                                    </app-enhanced-form-field>

                                    <app-enhanced-form-field
                                        type="checkbox"
                                        checkboxLabel="Enable Scheduled Reports"
                                        helpText="Allow automatic generation of reports on schedule"
                                        [(ngModel)]="config.reports.scheduled_reports_enabled">
                                    </app-enhanced-form-field>
                                </div>
                            </app-enhanced-card>
                        </div>
                    </p-tabpanel>
                </p-tabs>

                <!-- Enhanced Action Buttons -->
                <div slot="footer">
                    <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                        <app-enhanced-button
                            variant="primary"
                            size="md"
                            label="Save Configuration"
                            icon="pi pi-save"
                            [loading]="saving"
                            (onClick)="saveConfiguration()"
                            customClass="flex-1 sm:flex-none">
                        </app-enhanced-button>
                        
                        <app-enhanced-button
                            variant="secondary"
                            size="md"
                            label="Backup Configuration"
                            icon="pi pi-download"
                            (onClick)="backupConfiguration()"
                            customClass="flex-1 sm:flex-none">
                        </app-enhanced-button>
                        
                        <app-enhanced-button
                            variant="danger"
                            size="md"
                            label="Reset to Default"
                            icon="pi pi-refresh"
                            (onClick)="resetToDefault()"
                            customClass="flex-1 sm:flex-none">
                        </app-enhanced-button>
                    </div>
                </div>
            </app-enhanced-card>
        </div>
    `,
    styles: [`
        :host {
            display: block;
        }

        /* Enhanced Tabs Styling */
        :host ::ng-deep .enhanced-tabs .p-tabview-nav {
            background: linear-gradient(135deg, var(--gray-50), var(--primary-50));
            border-radius: var(--radius-lg) var(--radius-lg) 0 0;
            border-bottom: 2px solid var(--gray-200);
            padding: 0 var(--space-4);
        }

        :host ::ng-deep .enhanced-tabs .p-tabview-nav li {
            margin-right: var(--space-2);
        }

        :host ::ng-deep .enhanced-tabs .p-tabview-nav li .p-tabview-nav-link {
            background: transparent;
            border: none;
            border-radius: var(--radius-md) var(--radius-md) 0 0;
            padding: var(--space-4) var(--space-6);
            font-weight: var(--font-medium);
            color: var(--gray-600);
            transition: all var(--duration-normal) var(--ease-out);
            position: relative;
            overflow: hidden;
        }

        :host ::ng-deep .enhanced-tabs .p-tabview-nav li .p-tabview-nav-link:hover {
            background: var(--primary-50);
            color: var(--primary-700);
            transform: translateY(-2px);
        }

        :host ::ng-deep .enhanced-tabs .p-tabview-nav li.p-highlight .p-tabview-nav-link {
            background: white;
            color: var(--primary-600);
            font-weight: var(--font-semibold);
            box-shadow: var(--shadow-sm);
            border-bottom: 3px solid var(--primary-500);
        }

        :host ::ng-deep .enhanced-tabs .p-tabview-panels {
            background: white;
            border: none;
            padding: 0;
        }

        /* Form Field Enhancements */
        :host ::ng-deep .enhanced-form-field {
            margin-bottom: var(--space-6);
        }

        /* Card Hover Effects */
        :host ::ng-deep .enhanced-card:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-lg);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            :host ::ng-deep .enhanced-tabs .p-tabview-nav {
                padding: 0 var(--space-2);
            }

            :host ::ng-deep .enhanced-tabs .p-tabview-nav li .p-tabview-nav-link {
                padding: var(--space-3) var(--space-4);
                font-size: var(--text-sm);
            }
        }

        /* Animation for tab content */
        :host ::ng-deep .p-tabview-panel {
            animation: fadeInUp 0.3s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Enhanced checkbox styling */
        :host ::ng-deep .p-checkbox {
            margin-right: var(--space-3);
        }

        :host ::ng-deep .p-checkbox .p-checkbox-box {
            border-radius: var(--radius-sm);
            transition: all var(--duration-normal) var(--ease-out);
        }

        :host ::ng-deep .p-checkbox .p-checkbox-box:hover {
            transform: scale(1.05);
            box-shadow: var(--shadow-sm);
        }
    `]
})
export class ConfigurationPanelComponent implements OnInit {
    private configService = inject(ConfigurationService);

    // Lucide Icons
    SettingsIcon = Settings;
    SaveIcon = Save;
    DownloadIcon = Download;
    RotateCcwIcon = RotateCcw;

    config!: Configuration;
    saving = false;

    // Breadcrumbs for page header
    breadcrumbs = [
        { label: 'Dashboard', route: '/dashboard' },
        { label: 'Configuration' }
    ];

    kawasanTypes = [
        { label: 'KEK (Kawasan Ekonomi Khusus)', value: KawasanType.KEK },
        { label: 'KB (Kawasan Berikat)', value: KawasanType.KB },
        { label: 'KITE (Kemudahan Impor Tujuan Ekspor)', value: KawasanType.KITE }
    ];

    operationModes = [
        { label: 'Demo Mode', value: OperationMode.DEMO },
        { label: 'Production Mode', value: OperationMode.PRODUCTION }
    ];

    languages = [
        { label: 'Indonesian', value: 'id' },
        { label: 'English', value: 'en' }
    ];

    currencies = [
        { label: 'IDR (Indonesian Rupiah)', value: 'IDR' },
        { label: 'USD (US Dollar)', value: 'USD' }
    ];

    reportFormats = [
        { label: 'Excel', value: 'EXCEL' },
        { label: 'PDF', value: 'PDF' }
    ];

    ngOnInit(): void {
        this.loadConfiguration();
    }

    loadConfiguration(): void {
        this.configService.getConfiguration().subscribe(config => {
            this.config = config;
        });
    }

    saveConfiguration(): void {
        this.saving = true;
        this.configService.updateConfiguration(this.config, 'current_user').subscribe({
            next: () => {
                this.saving = false;
                console.log('Configuration saved successfully');
                alert('Configuration saved successfully');
            },
            error: (err) => {
                this.saving = false;
                console.error('Save failed:', err);
                alert('Failed to save configuration: ' + err.message);
            }
        });
    }

    backupConfiguration(): void {
        this.configService.backupConfiguration().subscribe(() => {
            console.log('Configuration backed up');
            alert('Configuration backed up successfully');
        });
    }

    resetToDefault(): void {
        if (confirm('Are you sure you want to reset to default configuration?')) {
            this.configService.resetToDefault('current_user').subscribe(config => {
                this.config = config;
                alert('Configuration reset to default');
            });
        }
    }
}
