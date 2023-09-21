import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public messages: [{ message: string; type: string }] = [
    { message: '', type: '' },
  ];
  add(message: string, type: string) {
    this.messages.push({ message, type });
  }
  clear(): void {
    this.messages = [{ message: '', type: '' }];
  }

  constructor() {}
}
