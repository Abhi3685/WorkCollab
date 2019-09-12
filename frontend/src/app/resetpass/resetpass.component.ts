import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.css']
})
export class ResetpassComponent implements OnInit {

  @ViewChild('pass', {static: false}) pass: ElementRef;
  @ViewChild('cpass', {static: false}) cpass: ElementRef;
  @ViewChild('resetPassBtn', {static: false}) resetPassBtn: ElementRef;
  userId;

  constructor(private userService: UserService, 
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit() {
    this.userId = this.route.snapshot.queryParams["id"];
    if(!this.userId)
      return Swal.fire({ type: 'error', text: 'OOPS! Something is wrong!' }).then(res => {
        this.router.navigate(['/']);
      });
  }

  resetPass() {
    let pass = this.pass.nativeElement.value;
    let cpass = this.cpass.nativeElement.value;
    if(pass != cpass) return Swal.fire({ type: 'error', text: 'Passwords don\'t match.' });
    this.resetPassBtn.nativeElement.innerHTML = 'Please Wait';
    this.userService.resetPass(this.userId, pass).subscribe(data => {
      this.resetPassBtn.nativeElement.innerHTML = 'Submit';
      if(data['err']) 
        return Swal.fire({ type: 'error', text: 'OOPS! Something is wrong!' }).then(res => {
          this.router.navigate(['/']);
        });
      Swal.fire({ type: 'success', text: 'Password Reset Successful!' }).then(res => {
        this.router.navigate(['/login']);
      });
    });
  }

}
