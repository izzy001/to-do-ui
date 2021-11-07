import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { TaskStatus } from '../interfaces/TaskStatus';
import { MessageService } from './message.service';


@Injectable({
  providedIn: 'root'
})
export class ToDoService {

  private toDoUrl = 'https://bunny-to-do-app.herokuapp.com';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  //get Users
  getUsers(): Observable<any> {
    return this.http.get(this.toDoUrl + '/api/users')
    .pipe(
      tap(_ => this.log('fetched users')),
      catchError(this.handleError('getUsers'))
    )
  };

  //get a User Tasks
  getUserTask(id: string): Observable<any> {
    const url = `${this.toDoUrl + '/api/tasks'}/${id}`;
    return this.http.get<any>(url).pipe(
      tap(_ => this.log(`fetched tasks for user = ${id}`)),
      catchError(this.handleError(`get task for user with id=${id}`))
    )
  };


  //create a new user 
  createUser(user: User): Observable<any> {
    const url = `${this.toDoUrl + '/api/users'}`
    return this.http.post(url, user, this.httpOptions)
            .pipe(
              tap(_=> this.log('added new user')),
              catchError(this.handleError('createUser'))
            );
  };


  //delete a user
  deleteUser(id: string): Observable<User>{
    const url = `${this.toDoUrl + '/api/users'}/${id}`;
    return this.http.delete<User>(url, this.httpOptions)
            .pipe(
              tap(_ =>this.log(`deleted user id=${id}`)),
              catchError(this.handleError<User>('deleteUser'))
            );
  };

  //create a new task lisft for user
  newUserTask(task: object): Observable<any> {
    const url = `${this.toDoUrl + '/api/tasks'}`;
    return this.http.post(url, task, this.httpOptions)
            .pipe(
              tap(_=> this.log(`added new task for user`)),
              catchError(this.handleError('newUserTask'))
            );
  };

//add new task to task list
addTaskToTaskList(tasks: object, id: string): Observable<any>{
  const url = `${this.toDoUrl + '/api/tasks/add-to-tasks-list'}/${id}`;
  return this.http.post(url , tasks, this.httpOptions)
          .pipe(
            tap(_ => this.log(`added new task to task list w/id = ${id}`)),
            catchError(this.handleError('addTaskToTaskList'))
          );
};

//update task status
updateTaskStatus(task: TaskStatus, id: string): Observable<any>{
  const url = `${this.toDoUrl + '/api/tasks'}/${id}`;
  return this.http.put(url, task, this.httpOptions)
        .pipe(
          tap(_ => this.log('task status for user changed')),
          catchError(this.handleError('updateTaskStatus'))
        );
};





   /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
  
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
  
        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.error.message || error.error.details}`);
  
        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }

      /** Log a ToDoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ToDoService: ${message}`);
  }
}
