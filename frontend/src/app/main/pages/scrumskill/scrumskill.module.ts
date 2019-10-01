import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxDnDModule } from '@swimlane/ngx-dnd';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseMaterialColorPickerModule } from '@fuse/components';

import { ScrumskillComponent } from './scrumskill.component';
import { ScrumskillService, SkillResolve } from 'app/shared/services/scrumskill.service';
import { SkillFormDialogComponent } from './skill-form-dialog/skill-form-dialog.component';
import { MaterialModule } from 'app/shared/material.module';
import { ImageCropperModule } from 'ngx-image-cropper';

const routes: Routes = [
    {
        path: 'skills',
        component: ScrumskillComponent,
        resolve: {
            scrumskill: ScrumskillService
        }
    },
    {
        path: 'ability-for-skill/:id',
        loadChildren: './ability-for-skill/ability-for-skill.module#AbilityForSkillModule'
    },
    {
        path: '**',
        redirectTo: 'boards'
    }
];

@NgModule({
    declarations: [
        ScrumskillComponent,
        SkillFormDialogComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,

        NgxDnDModule,
        ImageCropperModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseMaterialColorPickerModule
    ],
    providers: [
        ScrumskillService,
        SkillResolve
    ],
    entryComponents: [SkillFormDialogComponent]
})
export class ScrumskillModule {
}
