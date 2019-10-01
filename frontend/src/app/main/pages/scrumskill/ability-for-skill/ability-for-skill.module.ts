import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbilityForSkillComponent } from './ability-for-skill.component';
import { ScrumabilityService } from 'app/shared/services/scrumability.service';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseMaterialColorPickerModule } from '@fuse/components';
import { ScrumskillService, SkillResolve } from 'app/shared/services/scrumskill.service';
import { AbilityFormDialogComponent } from './ability-form-dialog/ability-form-dialog.component';
import { ImageCropperModule } from 'ngx-image-cropper';

const routes: Routes = [
  {
    path: '',
    component: AbilityForSkillComponent,
    resolve: {
      scrumskill: ScrumskillService
    }
  },
  {
    path: 'ability-detail/:id',
    loadChildren: './ability-detail/ability-detail.module#AbilityDetailModule'
  },
];


@NgModule({
  declarations: [AbilityForSkillComponent, AbilityFormDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseMaterialColorPickerModule,    
    ImageCropperModule,
  ],
  providers: [
    ScrumskillService,
    SkillResolve
  ],
  entryComponents: [
    AbilityFormDialogComponent
  ]
})
export class AbilityForSkillModule { }
