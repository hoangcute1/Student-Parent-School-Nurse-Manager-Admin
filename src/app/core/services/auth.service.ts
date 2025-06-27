import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        private toastr: ToastrService,
        private router: Router
    ) { }

    logout() {
        // Clear user session or token logic here
        console.log('User logged out');
    }

    handleSessionExpired() {
        this.toastr.warning('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        this.logout();
        this.router.navigate(['/login']);
    }

    isAdminOrStaff(): boolean {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');

        console.log('Checking role:', userRole);
        console.log('Token exists:', !!token);

        if (!token) {
            console.log('No token found');
            return false;
        }

        const hasAccess = userRole === 'ADMIN' || userRole === 'STAFF';
        console.log('Has access:', hasAccess);

        return hasAccess;
    }
}
