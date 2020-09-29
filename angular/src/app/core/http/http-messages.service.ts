import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IMessage, emptyMessage } from '@/shared/interfaces/IMessage';

@Injectable({
  providedIn: 'root'
})
export class HttpMessagesService {
  constructor(private http: HttpClient) {}

  /**
   * sending message to server
   */
  sendMessage(message: IMessage): Observable<string | any> {
    return this.http
      .post('http://localhost:5000/api/Message/register', message)
      .pipe(
        map(response => {
          return response;
        }),
        catchError(response => {
          return throwError(response);
        })
      );
  }

  /**
   * get recieved messages from server
   */
  getRecievedMessages(recievId: string): Observable<IMessage[] > {
    const body = null;
    const paramsObj = {
      recieverId: recievId
    };
    return this.http
      .post<IMessage[]>('http://localhost:5000/api/Message/GetMessages', body, {
        params: paramsObj
      })
      .pipe(
        map(response => {
          // reverse them so last message in will be shown on top
          return  response.reverse();
        }),
        catchError(response => {
          return throwError(response);
        })
      );
  }


  /**
   * get sent messages from server
   * @param sendId - sender id
   */
  getSentMessages(sendId: string): Observable<IMessage[] > {
    const body = null;
    const paramsObj = {
      senderId: sendId
    };
    return this.http
      .post<IMessage[]>('http://localhost:5000/api/Message/GetSentMessages', body, {
        params: paramsObj
      })
      .pipe(
        map(response => {
         // reverse them so last message in will be shown on top
          return  response.reverse();
        }),
        catchError(response => {
          return throwError(response);
        })
      );
  }
  /**
   * set messages as read
   * @param recievId - reciever id (email)
   */
  setAssReadMessages(recievId: string): Observable< string |any > {
    const body = null;
    const paramsObj = {
      recieverId: recievId
    };
    return this.http
      .post<IMessage[]>('http://localhost:5000/api/Message/SetAsRead', body, {
        params: paramsObj
      })
      .pipe(
        map(response => {
          return  response;
        }),
        catchError(response => {
          return throwError(response);
        })
      );
  }// end of setAsRead

  /**
   * removing message from server
   */
  removeMessage(messId: string): Observable<string | any> {
    const body = null;
    const paramsObj = {
      messageId: messId
    };
    return this.http
      .post<IMessage[]>('http://localhost:5000/api/Message/RemoveMessage', body, {
        params: paramsObj})
      .pipe(
        map(response => {
          return response;
        }),
        catchError(response => {
          return throwError(response);
        })
      );
  } // end of reoveMessage

  /**
   * set one message as read or unread according to its value of 'read' by flag
   */
  setMessageRead(messId: string, readFlag: string): Observable< string |any > {
    const body = null;
    const paramsObj = {
      messageId: messId,
      read: readFlag
    };
    return this.http
      .post('http://localhost:5000/api/Message/SetReadMessage', body, {
        params: paramsObj
      })
      .pipe(
        map(response => {
          return  response;
        }),
        catchError(response => {
          return throwError(response);
        })
      );
  }// end of setRead
}
