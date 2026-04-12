import { Routes } from '@angular/router';
import { HorizontalLayout } from './layouts/horizontal-layout/horizontal-layout';
import { pageWiseConfiguration } from './shared/data/pagewise-configuration';
import { CRUDEnum } from './shared/enum/crud.enum';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: 'initial',
        loadComponent: () => import("./pages/initial-page/initial-page")
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
                loadComponent: () => import('./pages/dashboard/dashboard')
                .then(c => c.Dashboard)
            },
            {
                path: 'connections',
                data: { config: pageWiseConfiguration.connections },
                loadComponent: () => import('./pages/connection-list/connection-list')
                .then(c => c.ConnectionList)
            },
            {
                path: 'connections/add/:id',
                data: { config: pageWiseConfiguration.connectionsAdd, mode: CRUDEnum.Create },
                loadComponent: () => import('./pages/connection-add/connection-add')
                .then(c => c.ConnectionAdd)
            },
            {
                path: 'connections/edit/:id',
                data: { config: pageWiseConfiguration.connectionsEdit, mode: CRUDEnum.Update },
                loadComponent: () => import('./pages/connection-add/connection-add')
                .then(c => c.ConnectionAdd)
            },
            {
                path: 'connections/view/:id',
                data: { config: pageWiseConfiguration.connectionsView, mode: CRUDEnum.Read },
                loadComponent: () => import('./pages/connection-view/connection-view')
                .then(c => c.ConnectionView)
            },
            {
                path: 'families',
                data: { config: pageWiseConfiguration.families },
                loadComponent: () => import('./pages/families/families')
                .then(c => c.Families)
            },
            {
                path: 'family/add',
                data: { config: pageWiseConfiguration.familyAdd, mode: CRUDEnum.Create },
                loadComponent: () => import('./pages/family-add/family-add')
                .then(c => c.FamilyAdd)
            },
            {
                path: 'family/edit/:id',
                data: { config: pageWiseConfiguration.familyAdd, mode: CRUDEnum.Update },
                loadComponent: () => import('./pages/family-add/family-add')
                .then(c => c.FamilyAdd)
            },
            {
                path: 'family/view/:id',
                data: { config: pageWiseConfiguration.familyAdd, mode: CRUDEnum.Read },
                loadComponent: () => import('./pages/family-add/family-add')
                .then(c => c.FamilyAdd)
            },
            {
                path: 'familyTree/:id',
                data: { config: pageWiseConfiguration.familyTree },
                loadComponent: () => import('./pages/family-tree/family-tree')
                .then(c => c.FamilyTree)
            },
            {
                path: 'profile',
                data: { config: pageWiseConfiguration.profile },
                loadComponent: () => import('./pages/profile/profile')
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
