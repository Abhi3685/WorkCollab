import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('email', {static: false}) email: ElementRef;
  @ViewChild('password', {static: false}) password: ElementRef;
  @ViewChild('femail', {static: false}) femail: ElementRef;
  @ViewChild('resetPassBtn', {static: false}) resetPassBtn: ElementRef;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    if(localStorage.getItem('token')) this.router.navigate(['/projects']);
  }

  loginUser() {
    var email = this.email.nativeElement.value;
    var password = this.password.nativeElement.value;

    this.userService.findUser(email, password).subscribe(res => {
      if (!res) return swal.fire({ type: 'error', title: 'No User Found!' });
      if(res['err']) return swal.fire({ type: 'warning', title: 'Invalid Email or Password' });

      localStorage.setItem('token', res['_id']);
      this.userService.setLoggedIn();
      this.router.navigate(['/projects']);
    });
  }

  resetPass() {
    var femail = this.femail.nativeElement.value;
    this.resetPassBtn.nativeElement.innerHTML = 'Please Wait';
    this.userService.forgotPass(femail).subscribe(data => {
      this.resetPassBtn.nativeElement.innerHTML = 'Submit';
      if(data['err']) return swal.fire({ type: 'error', text: 'There wasn\'t an account for that email.' });
      swal.fire({ type: 'success', text: 'Help is on the way.' });
    });
  }

}
