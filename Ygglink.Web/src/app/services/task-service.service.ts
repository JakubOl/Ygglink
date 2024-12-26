import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) { }

  getTasks(month: string): Observable<Task[]> {
    let params = new HttpParams()
      .set('month', month);

    return this.http.get<Task[]>(environment.TASK_API, { params: params, headers: httpOptions.headers });
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${environment.TASK_API}/${id}`, httpOptions);
  }

  addTasks(tasks: Task[]): Observable<Task> {
    return this.http.post<Task>(environment.TASK_API, tasks, httpOptions);
  }

  updateTask(task: Task): Observable<void> {
    return this.http.put<void>(environment.TASK_API, task, httpOptions);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.TASK_API}/${id}`, httpOptions);
  }
}
