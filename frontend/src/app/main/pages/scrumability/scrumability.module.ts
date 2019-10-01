import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxDnDModule } from '@swimlane/ngx-dnd';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseMaterialColorPickerModule } from '@fuse/components';

import { ScrumabilityService, AbilityResolve } from 'app/shared/services/scrumability.service';
import { MaterialModule } from 'app/shared/material.module';
import { ScrumabilityComponent } from './scrumability.component';
import { AbilityDialogComponent } from './ability-dialog/ability-dialog.component';
// import { abilityFormDialogComponent } from '../scrumability/skill-form-dialog/skill-form-dialog.component';

const routes: Routes = [
  {
    path: 'abilities',
    component: ScrumabilityComponent,
    resolve: {
      scrumability: ScrumabilityService
    }
  },
  // {
  //   path: 'ability-for-skill/:id',
  //   loadChildren: './ability-for-skill/ability-for-skill.module#AbilityForabilityModule'
  // },
];

@NgModule({
  declarations: [ScrumabilityComponent, AbilityDialogComponent],
  imports: [
    RouterModule.forChild(routes),
    MaterialModule,

    NgxDnDModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseMaterialColorPickerModule
  ],
  providers: [
    ScrumabilityService,
    AbilityResolve
  ],
  entryComponents: [
    AbilityDialogComponent
  ]
})
export class ScrumabilityModule { }
