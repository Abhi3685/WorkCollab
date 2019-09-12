import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  rootUrl = "http://localhost:8000";

  constructor(private http: HttpClient) { }

  createTask(name, desc, pId, listId) {
    return this.http.post(this.rootUrl + '/task/add', { name, desc, pId, listId });
  }

  getTasks(projectId){
    return this.http.get(this.rootUrl + '/task/project/' + projectId);
  }

  getTask(taskId){
    return this.http.get(this.rootUrl + '/task/' + taskId);
  }

  updateTask(updatedTask, taskId){
    return this.http.patch(this.rootUrl + '/task/' + taskId, updatedTask);
  }

  deleteTask(taskId){
    return this.http.delete(this.rootUrl + '/task/' + taskId);
  }

}
