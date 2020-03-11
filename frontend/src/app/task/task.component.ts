import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { ProjectService } from '../services/project.service';
import { CommentService } from '../services/comment.service';
import Swal from 'sweetalert2';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { AttachmentService } from '../services/attachment.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  task;
  project;
  pid; tid;
  projectMembers;
  taskUserId;
  comments; attachments;
  showLoader = true;
  uploader: FileUploader = new FileUploader({url: 'http://localhost:8000/attachment/add', itemAlias: 'uploadFile'});
  
  constructor(private route: ActivatedRoute, 
    private taskService: TaskService,
    private projectService: ProjectService, 
    private commentService: CommentService, 
    private router: Router, 
    private userService: UserService,
    private attachmentService: AttachmentService,
    private socketService: SocketService) { }
    
  ngOnInit() {
    this.getAllData();
    this.socketService.emitEvent('join', this.tid);
    this.socketService.listenToEvent('fetch updated task').subscribe((res) => {
      this.getAllData();
    });
    this.socketService.listenToEvent('leave task page').subscribe((res) => {
      this.goback();
    });
  }

  getAllData(){
    this.pid = this.route.snapshot.params['projectId'];
    this.tid = this.route.snapshot.params['taskId'];
    this.projectService.getProject(this.pid).subscribe(data => {
      if(!data) return this.router.navigate(['/project', this.pid]);
      if(data['err']) this.userService.clearLogIn();
      this.project = data;
      this.getProjectMembers();
    });
    this.fetchComments();
    this.fetchAttachments();
    this.taskService.getTask(this.tid).subscribe(data => {
      if(data['err'] == "Unauthorized Access") this.userService.clearLogIn();
      this.task = data;
      setTimeout(() => { this.showLoader = false; }, 500);
      if(data['assignedUser']) this.taskUserId = data['assignedUser']['_id'];
    });

    this.uploader.onBuildItemForm = (item, form) => {
      form.append('taskId', this.tid);
      form.append('projectId', this.pid);
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.socketService.emitEvent('task_updated', { tid: this.tid, pid: this.pid });
      this.attachments.push(JSON.parse(response));
    };
  }

  getProjectMembers() {
    this.userService.fetchUsersData(this.project.users).subscribe(res => {
      this.projectMembers = res;
    });
  }

  updateTask(des: HTMLInputElement, name: HTMLInputElement) {
    if(!name) return Swal.fire({ type: 'error', text: 'Task name can\'t be null' });
    let updatedTask;
    if(this.taskUserId) {
      updatedTask = { name: name.value, description: des.value, assignedUser: this.taskUserId }
    } else {
      updatedTask = { name: name.value, description: des.value }; 
    }
    this.taskService.updateTask(updatedTask, this.tid).subscribe(res => {
      this.socketService.emitEvent('task_updated', { tid: this.tid, pid: this.pid });
      this.goback();
    });
  }

  goback() {
    this.router.navigate(['/project', this.pid]);
  }

  deleteTask() {
    Swal.fire({
      type: 'warning', text: 'Are you sure you want to delete task?', showCancelButton: true
    }).then(res => {
      if(res.value)
        this.taskService.deleteTask(this.tid).subscribe(data => {
          this.socketService.emitEvent('task_deleted', { tid: this.tid, pid: this.pid });
          this.goback();
        });
    });
  }

  toggleTaskMember(userId){
    if(this.taskUserId == userId) this.taskUserId = null;
    else this.taskUserId = userId;
  }

  fetchComments() {
    this.commentService.getComments(this.tid).subscribe(comments => {
      this.comments = comments;
    });
  }

  addComment(comment) {
    this.commentService.addComment(comment, this.tid, this.pid).subscribe(data => {
      this.socketService.emitEvent('task_updated', { tid: this.tid, pid: this.pid });
      this.fetchComments();
    });
  }

  confirmCommentDelete(commentId, index) {
    Swal.fire({
      type: 'warning', text: 'Are you sure you want to delete comment?', showCancelButton: true
    }).then(res => {
      if(res.value){
        this.comments.splice(index, 1);
        this.commentService.deleteComment(commentId).subscribe(res => {
          this.socketService.emitEvent('task_updated', { tid: this.tid, pid: this.pid });
        });
      }
    });
  }

  fetchAttachments() {
    this.attachmentService.getAttachments(this.tid).subscribe(res => {
      this.attachments = res;
    });
  }

  confirmAttachmentDelete(attachmentId, index) {
    Swal.fire({
      type: 'warning', text: 'Are you sure you want to delete attachment?', showCancelButton: true
    }).then(res => {
      if(res.value){
        this.attachments.splice(index, 1);
        this.attachmentService.deleteAttachment(attachmentId).subscribe(res => {
          this.socketService.emitEvent('task_updated', { tid: this.tid, pid: this.pid });
        });
      }
    });
  }

  openAttachment(url) {
    window.open(url, '_blank');
  }

}
