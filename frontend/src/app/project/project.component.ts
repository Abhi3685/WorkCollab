import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import Swal from 'sweetalert2';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  edit = 0;
  project;
  l1; l2; l3; l4;
  showPanel = false; showLoader = true;
  userId = localStorage.getItem('token');

  constructor(private projectService: ProjectService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private taskService: TaskService,
    private userService: UserService) { }

  ngOnInit() {
    let id = this.route.snapshot.params['projectId'];
    this.projectService.getProject(id).subscribe(data => {
      if(!data) return this.router.navigate(['/projects']);
      if(data['err']) return this.userService.clearLogIn();
      this.project = data;
      this.fetchTasks();
    });
  }

  fetchTasks() {
    this.taskService.getTasks(this.project._id).subscribe(tasks => {
      this.segregateTasks(tasks);
    });
  }

  segregateTasks(tasks) {
    this.l1 = []; this.l2 = []; this.l3 = []; this.l4 = [];
    tasks.forEach(task => {
      if(task['listId'] == 1) this.l1.push(task);
      else if(task['listId'] == 2) this.l2.push(task);
      else if(task['listId'] == 3) this.l3.push(task);
      else if(task['listId'] == 4) this.l4.push(task);
    });
    setTimeout(() => { this.showLoader = false; }, 500);
  }

  addtask(name){
    this.taskService.createTask(name, '', this.project._id, this.edit).subscribe(data => {
      this.fetchTasks();
    });
  }

  renameProject(name) {
    this.projectService.renameProject(name, this.project._id).subscribe(data => {
      this.project = data;
    });
  }

  confirmDelete() {
    Swal.fire({
      type: 'warning', title: 'Are you sure you want to delete project?', showCancelButton: true
    }).then(res => {
      if(res.value) {
        this.showLoader = true;
        this.projectService.deleteProject(this.project._id).subscribe(data => {
          this.showLoader = false;
          if(!data) return this.router.navigate(['/projects']);
        });
      }
    });
  }

  confirmLeave() {
    Swal.fire({
      type: 'warning', title: 'Are you sure you want to leave project?', showCancelButton: true
    }).then(res => {
      if(res.value){
        this.projectService.leaveProject(this.project._id).subscribe(data => {
          if(!data) return this.router.navigate(['/projects']);
        });
      }
    });
  }

  addMember(userEmail) {
    this.projectService.addMember(userEmail, this.project._id).subscribe(data => {
      this.projectService.getProject(this.project._id).subscribe(data => {
        if(!data) return this.router.navigate(['/projects']);
        this.project = data;
      });
    });
  }

  removeMember(userId, name) {
    Swal.fire({
      type: 'warning', text: `Are you sure you want to remove ${name} from the project?`,
      showCancelButton: true
    }).then(res => {
      if(res.value) {
        this.projectService.removeMember(userId, this.project._id).subscribe(data => {
          this.projectService.getProject(this.project._id).subscribe(data => {
            if(!data) return this.router.navigate(['/projects']);
            this.project = data;
          });
        });
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container) {
      var updatedTask = event.previousContainer.data[event.previousIndex];
      updatedTask['listId'] = (+event.container.id.replace(/\D/g,'') % 4 + 1);
      if(updatedTask['listId'] > 4 || updatedTask['listId'] < 1) return alert('OOPS! Plz try again!');
      transferArrayItem(event.previousContainer.data, event.container.data,
                        event.previousIndex, event.currentIndex);
      this.taskService.updateTask(updatedTask, updatedTask['_id']).subscribe(res => {
        if(res['err']) {
          transferArrayItem(event.container.data, event.previousContainer.data,
                            event.currentIndex, event.previousIndex);
        }
      });
    } else {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

}
