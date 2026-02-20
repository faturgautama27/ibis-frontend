import { Routes } from '@angular/router';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemFormComponent } from './components/item-form/item-form.component';

/**
 * Item Master Routes
 * Defines routing for item master feature
 */
export const itemMasterRoutes: Routes = [
    {
        path: '',
        component: ItemListComponent
    },
    {
        path: 'create',
        component: ItemFormComponent
    },
    {
        path: 'edit/:id',
        component: ItemFormComponent
    },
    {
        path: 'view/:id',
        component: ItemFormComponent
    }
];
