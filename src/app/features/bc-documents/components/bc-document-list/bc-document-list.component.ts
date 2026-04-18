import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

// Services
import { BCDocumentDemoService } from '../../services/bc-document-demo.service';
import { ConfirmationService, MessageService } from 'primeng/api';

// Models
import { BCDocument, BCDocType, BCDocStatus, getBCDocTypeLabel, getBCDocStatusLabel } from '../../models/bc-document.model';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedTableComponent } from '../../../../shared/components/enhanced-table/enhanced-table.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

/**
 * BC Document List Component
 * Requirements: 5.1, 5.4, 5.5, 15.2
 */
@Component({
  selector: 'app-bc-document-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    // Enhanced Components
    PageHeaderComponent,
    EnhancedCardComponent,
    EnhancedTableComponent,
    EnhancedButtonComponent,
    StatusBadgeComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './bc-document-list.component.html',
  styleUrls: ['./bc-document-list.component.scss']
})
export class BCDocumentListComponent implements OnInit {
  private router = inject(Router);
  private bcDocumentService = inject(BCDocumentDemoService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  documents: BCDocument[] = [];
  filteredDocuments: BCDocument[] = [];
  loading = false;
  searchTerm = '';
  selectedType: BCDocType | null = null;
  selectedStatus: BCDocStatus | null = null;

  typeOptions = [
    { label: 'BC 2.3 - Import untuk Diolah', value: BCDocType.BC23 },
    { label: 'BC 2.5 - Import untuk Dipakai', value: BCDocType.BC25 },
    { label: 'BC 3.0 - Ekspor', value: BCDocType.BC30 },
    { label: 'BC 4.0 - Re-Ekspor', value: BCDocType.BC40 },
    { label: 'BC 2.7 - Subkontrak', value: BCDocType.BC27 }
  ];

  statusOptions = [
    { label: 'Draft', value: BCDocStatus.DRAFT },
    { label: 'Submitted', value: BCDocStatus.SUBMITTED },
    { label: 'Approved', value: BCDocStatus.APPROVED },
    { label: 'Rejected', value: BCDocStatus.REJECTED }
  ];

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading = true;
    this.bcDocumentService.getAll().subscribe({
      next: (documents) => {
        this.documents = documents;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to load BC documents'
        });
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.documents];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.doc_number.toLowerCase().includes(term) ||
        doc.partner_name.toLowerCase().includes(term) ||
        doc.partner_npwp.toLowerCase().includes(term)
      );
    }

    if (this.selectedType) {
      filtered = filtered.filter(doc => doc.doc_type === this.selectedType);
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(doc => doc.status === this.selectedStatus);
    }

    this.filteredDocuments = filtered;
  }

  onCreate(): void {
    this.router.navigate(['/bc-documents/new']);
  }

  onEdit(document: BCDocument): void {
    this.router.navigate(['/bc-documents/edit', document.id]);
  }

  onDelete(document: BCDocument): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete document ${document.doc_number}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bcDocumentService.delete(document.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'BC document deleted successfully'
            });
            this.loadDocuments();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Failed to delete BC document'
            });
          }
        });
      }
    });
  }

  onSubmit(document: BCDocument): void {
    this.confirmationService.confirm({
      message: `Submit document ${document.doc_number} for approval?`,
      header: 'Confirm Submit',
      icon: 'pi pi-send',
      accept: () => {
        this.bcDocumentService.submitDocument(document.id, 'admin').subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Document submitted successfully'
            });
            this.loadDocuments();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Failed to submit document'
            });
          }
        });
      }
    });
  }

  onApprove(document: BCDocument): void {
    this.confirmationService.confirm({
      message: `Approve document ${document.doc_number}?`,
      header: 'Confirm Approval',
      icon: 'pi pi-check',
      accept: () => {
        this.bcDocumentService.approveDocument(document.id, 'admin').subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Document approved successfully'
            });
            this.loadDocuments();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Failed to approve document'
            });
          }
        });
      }
    });
  }

  onReject(document: BCDocument): void {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      this.bcDocumentService.rejectDocument(document.id, 'admin', reason).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Document rejected'
          });
          this.loadDocuments();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to reject document'
          });
        }
      });
    }
  }

  getBCDocTypeLabel(type: BCDocType): string {
    return getBCDocTypeLabel(type);
  }

  getBCDocStatusLabel(status: BCDocStatus): string {
    return getBCDocStatusLabel(status);
  }

  getStatusSeverity(status: BCDocStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const severityMap: Record<BCDocStatus, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      [BCDocStatus.DRAFT]: 'secondary',
      [BCDocStatus.SUBMITTED]: 'info',
      [BCDocStatus.APPROVED]: 'success',
      [BCDocStatus.REJECTED]: 'danger'
    };
    return severityMap[status];
  }
}
