import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'SWP391-FE';

    constructor(public router: Router) {
        console.log('AppComponent initialized');
    }
}
