import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedTableComponent } from '../../../../shared/components/enhanced-table/enhanced-table.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

import { StockOpnameService } from '../../services/stock-opname.service';

@Component({
    selector: 'app-stock-opname-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        TagModule,
        TooltipModule,
        // Enhanced Components
        PageHeaderComponent,
        EnhancedCardComponent,
        EnhancedTableComponent,
        EnhancedButtonComponent,
        StatusBadgeComponent
    ],
    templateUrl: './stock-opname-list.component.html',
    styleUrls: ['./stock-opname-list.component.scss']
})
export class StockOpnameListComponent implements OnInit {
    private router = inject(Router);
    private opnameService = inject(StockOpnameService);

    opnames: any[] = [];

    ngOnInit(): void {
        this.opnameService.getAllOpnames().subscribe(data => {
            this.opnames = data;
        });
    }

    onCreate(): void {
        this.router.navigate(['/stock-opname/new']);
    }

    onEdit(opname: any): void {
        this.router.navigate(['/stock-opname', opname.id, 'edit']);
    }

    onDelete(opname: any): void {
        // Implement delete logic
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const statusLower = (status || '').toLowerCase();
        if (statusLower === 'completed' || statusLower === 'approved') return 'success';
        if (statusLower === 'draft') return 'secondary';
        if (statusLower === 'in_progress' || statusLower === 'in progress') return 'warn';
        if (statusLower === 'cancelled' || statusLower === 'rejected') return 'danger';
        return 'info';
    }
}
