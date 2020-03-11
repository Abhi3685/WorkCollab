import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  
  projects;
  showLoader = true;
  @ViewChild('createPjctBtn', {static: false}) createPjctBtn: ElementRef;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private userService: UserService,
    private socketService: SocketService) {
  }

  ngOnInit() {
    this.projectService.getProjects().subscribe(data => {
      if (data['err']) this.userService.clearLogIn();
      this.projects = data;
      setTimeout(() => { this.showLoader = false; }, 500);
    });
    this.socketService.emitEvent('join', localStorage.getItem('token'));
    this.socketService.listenToEvent('fetch projects').subscribe((res) => {
      this.projectService.getProjects().subscribe(data => {
        if (data['err']) this.userService.clearLogIn();
        this.projects = data;
      });
    });
  }

  addProject(name) {
    if (!name) return false;
    this.createPjctBtn.nativeElement.innerHTML = 'Please Wait';
    this.projectService.createProject(name).subscribe(data => {
      this.createPjctBtn.nativeElement.innerHTML = 'Create Project';
      if (data['err']) return this.userService.clearLogIn();
      this.router.navigate(['/project', data['_id']]);
    });
  }

}
