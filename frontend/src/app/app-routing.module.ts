import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './shared/services/auth.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: 'pages/skills', pathMatch: 'full' },
  { path: 'authentication', loadChildren: './main/authentication/authentication.module#AuthenticationModule' },
  { path: 'pages', loadChildren: './main/pages/pages.module#PagesModule',},
  { path: '**', redirectTo: 'apps/dashboards/analytics' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
