import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { Component, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from './message.model';
import { MessageService } from './message.service';

// import 'rxjs/Rx';  //observable third party library that enables .map()
// import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html'
})

export class MessageInputComponent implements OnInit{
  message: Message;

  constructor(private messageService: MessageService) {}



    onSubmit(form: NgForm) {
      if(this.message) {
        //create
        this.message.content = form.value.content;
        this.messageService.updateMessage(this.message)
        .subscribe(
            result => console.log(result)
        );
        this.message = null;
      }

      else {
        //edit
        const message = new Message(form.value.content, 'Nick');
        this.messageService.addMessage(message)
        .subscribe(
            data => console.log(data),
            error => console.log(error)
        );   //sends request to Observable
        form.resetForm();
      }
}

    onClear(form: NgForm) {
      this.message = null;
      form.resetForm();
    }


    ngOnInit() {
      this.messageService.messageIsEdit.subscribe(
        (message: Message) => this.message = message
      );
    }
}
