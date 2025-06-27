import { CanActivate } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AdminStaffGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    canActivate(): boolean {
        console.log('Guard is called');
        console.log('Current role:', localStorage.getItem('userRole'));

        if (!this.authService.isAdminOrStaff()) {
            console.log('Access denied');
            this.toastr.error('Bạn không có quyền truy cập vào trang này');
            this.router.navigate(['/']);
            return false;
        }
        console.log('Access granted');
        return true;
    }
}
