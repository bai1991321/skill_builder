import { NgModule } from '@angular/core';
import { ProfileModule } from 'app/main/pages/profile/profile.module';
import { ScrumskillModule } from './scrumskill/scrumskill.module';
import { RouterModule } from '@angular/router';
import { ScrumabilityModule } from './scrumability/scrumability.module';


const routes = [
    {
        path: 'scrumskill',
        loadChildren: './scrumskill/scrumskill.module#ScrumskillModule'
    },
    {
        path: 'scrumability',
        loadChildren: './scrumability/scrumability.module#ScrumabilityModule'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        // Profile
        ProfileModule,
        
        ScrumskillModule,
        ScrumabilityModule,
    ],
    declarations: []
})
export class PagesModule {

}
