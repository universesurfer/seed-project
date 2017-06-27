import { Message } from './message.model';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import 'rxjs/Rx';  //observable third party library that enables .map()
import { Observable } from 'rxjs/Rx';

@Injectable()    //@Injectable adds metadata to our class so we can use our service (which requires it)
export class MessageService {
  private messages: Message[] = [];
  messageIsEdit = new EventEmitter<Message>();

  constructor(private http: Http){}

  addMessage(message: Message) {
    const body = JSON.stringify(message);
    const headers = new Headers({'Content-Type': 'application/json'});
    const token = localStorage.getItem('token')
    ? '?token=' + localStorage.getItem('token')
    : '';
    return this.http.post('http://localhost:3000/message' + token, body, { headers: headers })
        .map((response: Response) => {
          const result = response.json();                 //in .map(), response automatically converted to Observable
          const message = new Message(result.obj.content, 'Dummy', result.obj._id, null);
          this.messages.push(message);
          return message;
  })
        .catch((error: Response) => Observable.throw(error.json()));   //in .catch(), it isn't, so we use Observable instead of response
      };

  getMessages() {
    return this.http.get('http://localhost:3000/message')
      .map((response: Response) => {
          const messages = response.json().obj;    //.obj is the field we set up in the node function
          let transformedMessages: Message[] = [];
          for (let message of messages) {
            transformedMessages.push(new Message(message.content, 'Dummy', message._id, null));
          }
          this.messages = transformedMessages;
          return transformedMessages;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  //EDIT MESSAGE
  editMessage(message: Message) {
    this.messageIsEdit.emit(message);
  }

  updateMessage(message: Message) {
    const body = JSON.stringify(message);
    const headers = new Headers({'Content-Type': 'application/json'});
    const token = localStorage.getItem('token')
    ? '?token=' + localStorage.getItem('token')
    : '';
    return this.http.patch('http://localhost:3000/message/' + message.messageId + token, body, { headers: headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()))
  }


  deleteMessage(message: Message) {
    this.messages.splice(this.messages.indexOf(message), 1);   //removes from frontend
    const token = localStorage.getItem('token')
    ? '?token=' + localStorage.getItem('token')
    : '';
    return this.http.delete('http://localhost:3000/message/' + message.messageId + token)   //removes from backend
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }
}
