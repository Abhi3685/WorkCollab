import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = "http://localhost:8000";
  private socket;

  constructor() {
    this.socket = io(this.url);
  }

  emitEvent(type, params) {
    this.socket.emit(type, params, function(err) {
      if (err) alert(err);
    });
  }

  listenToEvent = (type) => {
    return Observable.create((observer) => {
      this.socket.on(type, (res) => {
        observer.next(res);
      });
    });
  }
}
