import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  rootUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  addComment(comment, taskId, projectId) {
    return this.http.post(this.rootUrl + '/comment/add', {
      taskId, projectId, comment
    });
  }

  getComments(taskId) {
    return this.http.get(this.rootUrl + '/comment/' + taskId);
  }

  deleteComment(commentId) {
    return this.http.delete(this.rootUrl + '/comment/' + commentId);
  }

}
