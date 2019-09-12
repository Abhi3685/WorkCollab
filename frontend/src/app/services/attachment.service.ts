import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  rootUrl = 'http://localhost:8000';
  constructor(private http: HttpClient) { }

  getAttachments(taskId) {
    return this.http.get(this.rootUrl + '/attachment/' + taskId);
  }

  deleteAttachment(attachmentId) {
    return this.http.delete(this.rootUrl + '/attachment/' + attachmentId);
  }

}
