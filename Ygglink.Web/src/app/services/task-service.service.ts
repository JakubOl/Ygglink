import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskItem } from '../models/task';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) { }

  getTasks(month: string): Observable<TaskItem[]> {
    let params = new HttpParams().set('month', month);
    return this.http.get<TaskItem[]>(environment.TASK_API, { params: params, headers: httpOptions.headers });
  }

  getTask(id: string): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${environment.TASK_API}/${id}`, httpOptions);
  }

  addTask(task: TaskItem): Observable<TaskItem> {
    return this.http.post<TaskItem>(environment.TASK_API, task, httpOptions);
  }

  updateTask(task: TaskItem): Observable<void> {
    return this.http.put<void>(environment.TASK_API, task, httpOptions);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.TASK_API}/${id}`, httpOptions);
  }
}
