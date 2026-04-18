import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from '../../services/user-management.service';
import { User, UserRole, UserStatus, validatePassword } from '../../models/user.model';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

/**
 * User List Component
 * Requirements: 19.1, 19.2, 19.3
 */
@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        TagModule,
        DialogModule,
        InputTextModule,
        SelectModule,
        // Enhanced Components
        PageHeaderComponent,
        EnhancedCardComponent,
        EnhancedButtonComponent,
        StatusBadgeComponent
    ],
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
    private userService = inject(UserManagementService);
    private fb = inject(FormBuilder);

    users: User[] = [];
    userActivities: any[] = [];
    displayDialog = false;
    displayActivityDialog = false;
    isEditMode = false;
    selectedUser: User | null = null;

    userForm: FormGroup;

    roleOptions = [
        { label: 'Admin', value: UserRole.ADMIN },
        { label: 'Warehouse', value: UserRole.WAREHOUSE },
        { label: 'Production', value: UserRole.PRODUCTION },
        { label: 'Audit', value: UserRole.AUDIT }
    ];

    statusOptions = [
        { label: 'Active', value: UserStatus.ACTIVE },
        { label: 'Inactive', value: UserStatus.INACTIVE },
        { label: 'Suspended', value: UserStatus.SUSPENDED }
    ];

    constructor() {
        this.userForm = this.fb.group({
            username: ['', Validators.required],
            full_name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: [''],
            role: [UserRole.WAREHOUSE, Validators.required],
            status: [UserStatus.ACTIVE, Validators.required],
            phone: [''],
            department: ['']
        });
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.userService.getAllUsers().subscribe(users => {
            this.users = users;
        });
    }

    showCreateDialog(): void {
        this.isEditMode = false;
        this.selectedUser = null;
        this.userForm.reset({
            role: UserRole.WAREHOUSE,
            status: UserStatus.ACTIVE
        });
        this.userForm.get('password')?.setValidators([Validators.required]);
        this.userForm.get('password')?.updateValueAndValidity();
        this.displayDialog = true;
    }

    showEditDialog(user: User): void {
        this.isEditMode = true;
        this.selectedUser = user;
        this.userForm.patchValue(user);
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
        this.displayDialog = true;
    }

    saveUser(): void {
        if (!this.userForm.valid) return;

        const formValue = this.userForm.value;

        if (this.isEditMode && this.selectedUser) {
            this.userService.updateUser(this.selectedUser.id, formValue, 'current_user').subscribe({
                next: () => {
                    this.loadUsers();
                    this.displayDialog = false;
                },
                error: (err) => console.error('Update failed:', err)
            });
        } else {
            this.userService.createUser(formValue, formValue.password, 'current_user').subscribe({
                next: () => {
                    this.loadUsers();
                    this.displayDialog = false;
                },
                error: (err) => console.error('Create failed:', err)
            });
        }
    }

    deleteUser(user: User): void {
        if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
            this.userService.deleteUser(user.id, 'current_user').subscribe({
                next: () => this.loadUsers(),
                error: (err) => console.error('Delete failed:', err)
            });
        }
    }

    showActivityDialog(user: User): void {
        this.userService.getUserActivities(user.id, 50).subscribe(activities => {
            this.userActivities = activities;
            this.displayActivityDialog = true;
        });
    }

    getRoleSeverity(role: UserRole): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const map: Record<UserRole, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
            [UserRole.ADMIN]: 'danger',
            [UserRole.WAREHOUSE]: 'info',
            [UserRole.PRODUCTION]: 'success',
            [UserRole.AUDIT]: 'warn'
        };
        return map[role] || 'info';
    }

    getStatusSeverity(status: UserStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const map: Record<UserStatus, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
            [UserStatus.ACTIVE]: 'success',
            [UserStatus.INACTIVE]: 'secondary',
            [UserStatus.SUSPENDED]: 'danger'
        };
        return map[status] || 'info';
    }
}
