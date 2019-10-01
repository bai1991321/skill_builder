import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbilityDetailComponent } from './ability-detail.component';
import { AbilityDetailFormDialogComponent } from './ability-detail-form-dialog/ability-detail-form-dialog.component';
import { ScrumskillService, SkillResolve } from 'app/shared/services/scrumskill.service';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseMaterialColorPickerModule } from '@fuse/components';
import { TagFormDialogComponent } from './tag-form-dialog/tag-form-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: AbilityDetailComponent,
    resolve: {
      scrumskill: ScrumskillService
    }
  }
];

@NgModule({
  declarations: [AbilityDetailComponent, AbilityDetailFormDialogComponent, TagFormDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseMaterialColorPickerModule
  ],
  providers: [
    ScrumskillService,
    SkillResolve
  ],
  entryComponents: [
    AbilityDetailFormDialogComponent, TagFormDialogComponent
  ]
})
export class AbilityDetailModule { }
