import { Routes } from '@angular/router';
import { HorizontalLayout } from './layouts/horizontal-layout/horizontal-layout';
import { pageWiseConfiguration } from './core/data/pagewise-configuration';
import { CRUDEnum } from './core/enum/crud.enum';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: 'initial',
        loadComponent: () => import("./features/initial-page/initial-page")
        .then(c => c.InitialPage)
    },
    {
        path: '',
        component: HorizontalLayout,
        canActivateChild: [authGuard],
        children: [
            {
                path: 'dashboard',
                data: { config: pageWiseConfiguration.dashboard },
                loadComponent: () => import('./features/dashboard/dashboard')
                .then(c => c.Dashboard)
            },
            {
                path: 'connections',
                data: { config: pageWiseConfiguration.connections },
                loadComponent: () => import('./features/connection-list/connection-list')
                .then(c => c.ConnectionList)
            },
            {
                path: 'connections/add/:id',
                data: { config: pageWiseConfiguration.connectionsAdd, mode: CRUDEnum.Create },
                loadComponent: () => import('./features/connection-add/connection-add')
                .then(c => c.ConnectionAdd)
            },
            {
                path: 'connections/edit/:id',
                data: { config: pageWiseConfiguration.connectionsEdit, mode: CRUDEnum.Update },
                loadComponent: () => import('./features/connection-add/connection-add')
                .then(c => c.ConnectionAdd)
            },
            {
                path: 'connections/view/:id',
                data: { config: pageWiseConfiguration.connectionsView, mode: CRUDEnum.Read },
                loadComponent: () => import('./features/connection-view/connection-view')
                .then(c => c.ConnectionView)
            },
            {
                path: 'families',
                data: { config: pageWiseConfiguration.families },
                loadComponent: () => import('./features/families/families')
                .then(c => c.Families)
            },
            {
                path: 'familyTree/:id',
                data: { config: pageWiseConfiguration.familyTree },
                loadComponent: () => import('./features/family-tree/family-tree')
                .then(c => c.FamilyTree)
            },
            {
                path: 'profile',
                data: { config: pageWiseConfiguration.profile },
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
