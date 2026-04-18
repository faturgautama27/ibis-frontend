import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// PrimeNG imports
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

// Services
import { BCDocumentDemoService } from '../../services/bc-document-demo.service';
import { MessageService } from 'primeng/api';

// Models
import { BCDocument, BCDocType, BCDocStatus } from '../../models/bc-document.model';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';

/**
 * BC Document Form Component
 * Requirements: 5.1, 5.4, 5.5, 15.2
 */
@Component({
  selector: 'app-bc-document-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    InputNumberModule,
    FileUploadModule,
    ToastModule,
    // Enhanced Components
    PageHeaderComponent,
    EnhancedCardComponent,
    EnhancedButtonComponent
  ],
  providers: [MessageService],
  templateUrl: './bc-document-form.component.html',
  styleUrls: ['./bc-document-form.component.scss']
})
export class BCDocumentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private bcDocumentService = inject(BCDocumentDemoService);
  private messageService = inject(MessageService);

  documentForm!: FormGroup;
  isEditMode = false;
  documentId: string | null = null;
  loading = false;
  error: string | null = null;
  uploadedFiles: string[] = [];

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

  currencyOptions = [
    { label: 'IDR', value: 'IDR' },
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'JPY', value: 'JPY' },
    { label: 'SGD', value: 'SGD' }
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  initializeForm(): void {
    this.documentForm = this.fb.group({
      doc_number: ['', Validators.required],
      doc_type: [null, Validators.required],
      doc_date: [new Date(), Validators.required],
      status: [BCDocStatus.DRAFT],
      partner_id: [''],
      partner_name: ['', Validators.required],
      partner_npwp: ['', Validators.required],
      invoice_number: [''],
      invoice_date: [null],
      bl_awb_number: [''],
      bl_awb_date: [null],
      customs_office_code: [''],
      customs_office_name: [''],
      total_value: [0, [Validators.required, Validators.min(0)]],
      currency: ['IDR'],
      exchange_rate: [1],
      notes: ['']
    });
  }

  checkEditMode(): void {
    this.documentId = this.route.snapshot.paramMap.get('id');
    if (this.documentId) {
      this.isEditMode = true;
      this.loadDocument(this.documentId);
    }
  }

  loadDocument(id: string): void {
    this.loading = true;
    this.bcDocumentService.getById(id).subscribe({
      next: (document) => {
        this.documentForm.patchValue({
          ...document,
          doc_date: new Date(document.doc_date),
          invoice_date: document.invoice_date ? new Date(document.invoice_date) : null,
          bl_awb_date: document.bl_awb_date ? new Date(document.bl_awb_date) : null
        });
        this.uploadedFiles = document.attachment_files || [];
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load BC document';
        this.loading = false;
      }
    });
  }

  onFileSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      this.uploadedFiles.push(file.name);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'File uploaded successfully'
      });
    }
  }

  removeFile(fileName: string): void {
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== fileName);
  }

  onSubmit(): void {
    if (this.documentForm.invalid) {
      Object.keys(this.documentForm.controls).forEach(key => {
        this.documentForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = {
      ...this.documentForm.value,
      attachment_files: this.uploadedFiles,
      created_by: 'admin',
      updated_by: 'admin'
    };

    const operation = this.isEditMode && this.documentId
      ? this.bcDocumentService.update(this.documentId, formValue)
      : this.bcDocumentService.create(formValue);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `BC document ${this.isEditMode ? 'updated' : 'created'} successfully`
        });
        setTimeout(() => {
          this.router.navigate(['/bc-documents']);
        }, 1000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to save BC document';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/bc-documents']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.documentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
