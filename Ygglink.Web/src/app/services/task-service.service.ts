import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskItem } from '../models/task';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) { }

  getTasks(month: string): Observable<TaskItem[]> {
    let params = new HttpParams().set('month', month);
    return this.http.get<TaskItem[]>(environment.TASK_API, { params });
  }

  getTask(id: number): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${environment.TASK_API}/${id}`);
  }

  addTask(task: TaskItem): Observable<TaskItem> {
    return this.http.post<TaskItem>(environment.TASK_API, task);
  }

  updateTask(task: TaskItem): Observable<void> {
    return this.http.put<void>(`${environment.TASK_API}/${task.id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.TASK_API}/${id}`);
  }
}
