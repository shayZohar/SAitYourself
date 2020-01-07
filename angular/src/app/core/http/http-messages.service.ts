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

  /////////////////////////////////////////
  ///// sending message to server
  ////////////////////////////////////////
  sendMessage(message: IMessage): Observable<string | any> {
    return this.http
      .post('http://localhost:5000/api/Message/register', message)
      .pipe(
        map(response => {
          console.log(response);
          return response;
        }),
        catchError(response => {
          console.log('error sending message');
          return throwError(response);
        })
      );
  } // end of signUp
  ///////////////////////////////
  // method to get recieved messages from server
  /////////////////////////////////
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
          console.log(recievId);
          console.log('Message recieved: ' + response);
          return  response;
        }),
        catchError(response => {
          console.log('error');
          return throwError(response);
        })
      );
  }

  ///////////////////////////////
  // method to get recieved messages from server
  /////////////////////////////////
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
          console.log(sendId);
          console.log('Message sent: ' + response);
          return  response;
        }),
        catchError(response => {
          console.log('error');
          return throwError(response);
        })
      );
  }
  ///////////////////////////////
  // method to set messages as read
  /////////////////////////////////
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
          console.log(recievId + 'messages updated');
          return  response;
        }),
        catchError(response => {
          console.log('error');
          return throwError(response);
        })
      );
  }// end of setAsRead

  /////////////////////////////////////////
  ///// removing message from server
  ////////////////////////////////////////
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
          console.log(response + 'message removed successfuly');
          return response;
        }),
        catchError(response => {
          console.log('error deleting message');
          return throwError(response);
        })
      );
  } // end of reoveMessage
  ////////////////////////////////////////////////////////////////////////////////
  // method to set one message as read or unread according to its value of 'read'
  ////////////////////////////////////////////////////////////////////////////////
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
          console.log(messId + ' message updated as read=true');
          return  response;
        }),
        catchError(response => {
          console.log('error');
          return throwError(response);
        })
      );
  }// end of setRead
  // ///////////////////////////////
  // // method to set one message as read
  // /////////////////////////////////
  // setMessageAsUnRead(messId: string): Observable< string |any > {
  //   const body = null;
  //   const paramsObj = {
  //     messageId: messId
  //   };
  //   return this.http
  //     .post('http://localhost:5000/api/Message/SetUnReadMessage', body, {
  //       params: paramsObj
  //     })
  //     .pipe(
  //       map(response => {
  //         console.log(messId + ' message updated as read=true');
  //         return  response;
  //       }),
  //       catchError(response => {
  //         console.log('error');
  //         return throwError(response);
  //       })
  //     );
  // }// end of setAsUnRead
}
