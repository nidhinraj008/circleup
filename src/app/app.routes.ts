import { Routes } from '@angular/router';
import { HorizontalLayout } from './layouts/horizontal-layout/horizontal-layout';

export const routes: Routes = [
    {
        path: '',
        component: HorizontalLayout,
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard')
                .then(c => c.Dashboard)
            },
            {
                path: 'connections',
                loadComponent: () => import('./features/connection-list/connection-list')
                .then(c => c.ConnectionList)
            },
            {
                path: 'connections/add',
                loadComponent: () => import('./features/connection-add/connection-add')
                .then(c => c.ConnectionAdd)
            },
            {
                path: 'connections/edit',
                loadComponent: () => import('./features/connection-add/connection-add')
                .then(c => c.ConnectionAdd)
            },
            {
                path: 'connections/view',
                loadComponent: () => import('./features/connection-add/connection-add')
                .then(c => c.ConnectionAdd)
            },
            {
                path: 'familyTree',
                loadComponent: () => import('./features/family-tree/family-tree')
                .then(c => c.FamilyTree)
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/profile/profile')
                .then(c => c.Profile)
            },
            {
                path: '',
                redirectTo: 'dashboard' ,
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];
