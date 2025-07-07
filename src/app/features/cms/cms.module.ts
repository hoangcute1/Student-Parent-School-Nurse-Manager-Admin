import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsComponent } from './cms.component';


@NgModule({
    declarations: [CmsComponent],
    imports: [
        CommonModule
    ],
    exports: [CmsComponent]
})
export class CmsModule { }
