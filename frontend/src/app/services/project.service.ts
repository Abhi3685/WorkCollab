import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  rootUrl = "http://localhost:8000";

  constructor(private http: HttpClient) { }

  getProjects() {
    return this.http.get(this.rootUrl + '/project');
  }

  createProject(name) {
    return this.http.post(this.rootUrl + '/project/add', { name });
  }

  renameProject(name, id){
    return this.http.patch(this.rootUrl + '/project/' + id, { name });
  }

  getProject(id) {
    return this.http.get(this.rootUrl + '/project/' + id);
  }

  deleteProject(id) {
    return this.http.delete(this.rootUrl + '/project/' + id);
  }

  leaveProject(id) {
    return this.http.post(this.rootUrl + '/project/leave', { projectId: id });
  }

  addMember(userEmail, projectId){
    return this.http.post(this.rootUrl + '/project/adduser', { userEmail, projectId });
  }

  removeMember(userId, projectId){
    return this.http.post(this.rootUrl + '/project/removeuser', { userId, projectId });
  }

}
