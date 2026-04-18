import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { trigger, state, style, transition, animate } from '@angular/animations';

/**
 * Enhanced Modal Component
 * Provides enhanced styling with backdrop overlays, smooth animations, and consistent styling
 * Requirements: 26.1, 26.2, 26.3, 26.4, 26.5, 26.6, 26.7
 */
@Component({
  selector: 'app-enhanced-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './enhanced-modal.component.html',
  styleUrls: ['./enhanced-modal.component.scss'],
  animations: [
    trigger('modalAnimation', [
      state('in', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out')
      ]),
      transition('* => void', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class EnhancedModalComponent implements OnInit, OnDestroy {
  @Input() visible = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() headerIcon = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  @Input() draggable = false;
  @Input() resizable = false;
  @Input() closable = true;
  @Input() closeOnEscape = true;
  @Input() dismissableMask = true;
  @Input() maximizable = false;
  @Input() baseZIndex = 1000;
  @Input() autoZIndex = true;
  @Input() showHeader = true;
  @Input() showCustomHeader = false;
  @Input() headerActions = false;
  @Input() blockScroll = true;
  @Input() customStyleClass = '';
  @Input() contentClass = '';

  // Footer configuration
  @Input() showFooter = true;
  @Input() showDefaultFooter = true;
  @Input() showCancelButton = true;
  @Input() showConfirmButton = true;
  @Input() cancelLabel = 'Cancel';
  @Input() confirmLabel = 'Confirm';
  @Input() confirmIcon = 'pi pi-check';
  @Input() confirmSeverity: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' = 'primary';
  @Input() confirmLoading = false;
  @Input() confirmDisabled = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() modalShow = new EventEmitter<void>();
  @Output() modalHide = new EventEmitter<void>();
  @Output() maximize = new EventEmitter<any>();
  @Output() maskClick = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get dialogStyle(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};

    switch (this.size) {
      case 'sm':
        styles['width'] = '90vw';
        styles['max-width'] = '400px';
        break;
      case 'md':
        styles['width'] = '90vw';
        styles['max-width'] = '500px';
        break;
      case 'lg':
        styles['width'] = '90vw';
        styles['max-width'] = '800px';
        break;
      case 'xl':
        styles['width'] = '95vw';
        styles['max-width'] = '1200px';
        break;
      case 'full':
        styles['width'] = '95vw';
        styles['height'] = '95vh';
        break;
    }

    return styles;
  }

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  onModalShow(): void {
    this.modalShow.emit();
  }

  onModalHide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.modalHide.emit();
  }

  onModalMaximize(event: any): void {
    this.maximize.emit(event);
  }

  onMaskClick(): void {
    this.maskClick.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
    this.onModalHide();
  }

  /**
   * Programmatically show the modal
   */
  showModal(): void {
    this.visible = true;
    this.visibleChange.emit(true);
  }

  /**
   * Programmatically hide the modal
   */
  hideModal(): void {
    this.onModalHide();
  }
}