import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn: boolean;

  constructor(private userService: UserService, private router: Router) { 
  }

  ngOnInit() {
    if(localStorage.getItem('token')) this.isLoggedIn = true;
    else this.isLoggedIn = false;
    
    this.userService.getLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  confirmLogout() {
    Swal.fire({
      type: 'question',
      text: 'Are you sure you want to logout?',
      showCancelButton: true
    }).then(res => {
      if(res.value){
        this.userService.clearLogIn();
        this.router.navigate(['/login']);
      }
    });
  }

}
