import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @ViewChild('email', {static: false}) email: ElementRef;
  @ViewChild('name', {static: false}) name: ElementRef;
  @ViewChild('password', {static: false}) password: ElementRef;
  @ViewChild('confirmPassword', {static: false}) confirmPassword: ElementRef;
  @ViewChild('registerBtn', {static: false}) registerBtn: ElementRef;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    if(sessionStorage.getItem('token')) this.router.navigate(['/projects']);
  }

  validateForm() {
    var email = this.email.nativeElement.value;
    var name = this.name.nativeElement.value;
    var password = this.password.nativeElement.value;
    var confirmPassword = this.confirmPassword.nativeElement.value;
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    
    if (email == '' || name == '' || password == '') {
      swal.fire({ type: 'warning', title: 'Please fill out all the details' });
      return false;
    }
    if (!reg.test(email)) { 
      swal.fire({ type: 'error', title: 'Invalid Email Address' });
      return false;
    }
    if (password != confirmPassword) {
      swal.fire({ type: 'error', title: 'Passwords don\'t match' });
      return false;
    }
    return true;
  }

  registerUser() {
    if(!this.validateForm()) return;
    this.registerBtn.nativeElement.innerHTML = 'Please Wait';

    var email = this.email.nativeElement.value;
    var name = this.name.nativeElement.value;
    var password = this.password.nativeElement.value;
    let user = { email, name, password };

    this.userService.createUser(user).subscribe(res => {
        this.registerBtn.nativeElement.innerHTML = 'Register';
        if(res['err']) return swal.fire({ type: 'warning', title: 'Email Already Exists' });
        swal.fire({ type: 'success', title: 'Registeration Success' }).then(res => {
          this.router.navigate(['/login']);
        });
      }
    );
  }

}
