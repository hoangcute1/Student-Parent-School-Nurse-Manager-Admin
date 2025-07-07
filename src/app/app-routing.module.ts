import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { AdminStaffGuard } from './core/guards/admin-staff.guard';
import { CmsComponent } from './features/cms/cms.component';

const routes: Routes = [
    {
        path: 'cms',
        component: CmsComponent,
        canActivate: [AdminStaffGuard],
    },
    {
        path: '',
        component: CmsComponent,  // Thay thế bằng component trang chủ của bạn
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        enableTracing: true // Thêm dòng này để debug routing
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
