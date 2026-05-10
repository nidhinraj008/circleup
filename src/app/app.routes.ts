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
                path: 'persons',
                data: { config: pageWiseConfiguration.persons },
                loadComponent: () => import('./pages/person/list/person-list')
                    .then(c => c.PersonList)
            },
            {
                path: 'persons/add/:id',
                data: { config: pageWiseConfiguration.personsAdd, mode: CRUDEnum.Create },
                loadComponent: () => import('./pages/person/add/person-add')
                    .then(c => c.PersonAdd)
            },
            {
                path: 'persons/edit/:id',
                data: { config: pageWiseConfiguration.personsEdit, mode: CRUDEnum.Update },
                loadComponent: () => import('./pages/person/add/person-add')
                    .then(c => c.PersonAdd)
            },
            {
                path: 'persons/view/:id',
                data: { config: pageWiseConfiguration.personsView, mode: CRUDEnum.Read },
                loadComponent: () => import('./pages/person/view/person-view')
                    .then(c => c.PersonView)
            },
            {
                path: 'families',
                data: { config: pageWiseConfiguration.families },
                loadComponent: () => import('./pages/family/list/families')
                    .then(c => c.Families)
            },
            {
                path: 'family/add',
                data: { config: pageWiseConfiguration.familyAdd, mode: CRUDEnum.Create },
                loadComponent: () => import('./pages/family/add/family-add')
                    .then(c => c.FamilyAdd)
            },
            {
                path: 'family/edit/:id',
                data: { config: pageWiseConfiguration.familyEdit, mode: CRUDEnum.Update },
                loadComponent: () => import('./pages/family/add/family-add')
                    .then(c => c.FamilyAdd)
            },
            {
                path: 'familyTree/:id',
                data: { config: pageWiseConfiguration.familyTree },
                loadComponent: () => import('./pages/family/tree/family-tree')
                    .then(c => c.FamilyTree)
            },
            {
                path: 'profile',
                data: { config: pageWiseConfiguration.profile },
                loadComponent: () => import('./pages/profile/profile')
                    .then(c => c.Profile)
            },
            {
                path: 'settings',
                data: { config: pageWiseConfiguration.settings },
                loadComponent: () => import('./pages/settings/settings')
                    .then(c => c.Settings)
            },
            {
                path: 'about',
                data: { config: pageWiseConfiguration.about },
                loadComponent: () => import('./pages/about/about')
                    .then(c => c.About)
            },
            {
                path: 'relations',
                data: { config: pageWiseConfiguration.relations },
                loadComponent: () => import('./pages/relation/list/relations')
                    .then(c => c.Relations)
            },
            {
                path: 'relations/add',
                data: { config: pageWiseConfiguration.relationsAdd, mode: CRUDEnum.Create },
                loadComponent: () => import('./pages/relation/add/relation-add')
                    .then(c => c.RelationAdd)
            },
            {
                path: 'relations/edit/:id',
                data: { config: pageWiseConfiguration.relationsAdd, mode: CRUDEnum.Update },
                loadComponent: () => import('./pages/relation/add/relation-add')
                    .then(c => c.RelationAdd)
            },
            {
                path: 'relations/view/:id',
                data: { config: pageWiseConfiguration.relationsView, mode: CRUDEnum.Read },
                loadComponent: () => import('./pages/relation/view/relation-view')
                    .then(c => c.RelationView)
            },
            {
                path: '',
                redirectTo: 'dashboard',
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
