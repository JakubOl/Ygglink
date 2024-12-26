import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { addDays, addMonths, addWeeks } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject<any>();
  tasks: Task[] = [];
  events: CalendarEvent[] = [];

  constructor(private dialog: MatDialog, 
    private taskService: TaskService, 
    private snackBar: MatSnackBar) 
  { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void{
    const month = moment(this.viewDate).format('YYYY-MM');

    this.taskService
      .getTasks(month)
      .subscribe(tasks => {
        this.tasks = tasks;
        this.loadEvents();
      });
  }

  loadEvents(): void {
    this.events = this.tasks.map((task) => {
      return {
        id: task.guid,
        title: task.title,
        start: new Date(task.startDate),
        end: task.endDate ? new Date(task.endDate) : undefined,
        color: this.getPriorityColor(task.priority),
        draggable: false,
        resizable: { beforeStart: true, afterEnd: true },
        meta: {
          priority: task.priority
        }
      };
    });

    this.refresh.next(null);
  }

  eventClicked(event: CalendarEvent) {
    const task = this.tasks.find((t) => t.guid === event.id);
    if (!task)
      return;

    this.dialog
      .open(TaskDialogComponent, {
        width: '400px',
        data: { isEdit: true, task: { ...task } }
      })
      .afterClosed()
      .subscribe((updatedTask: any) => {
        if(updatedTask == "Closed")
          return;

        if(updatedTask == "Deleted"){
          this.taskService.deleteTask(task.guid).subscribe({
            next: () => {
              this.tasks = this.tasks.filter(t => t.guid !== task.guid);
              this.loadEvents();
              this.snackBar.open(`Task deleted.`, 'Close', { duration: 3000 });
            },
            error: () => {
              this.snackBar.open(`Failed to delete task. Please try again.`, 'Close', { duration: 3000 });
            }
          });
          
          return;
        }

        if (updatedTask) {
          this.applyTaskChanges(updatedTask);
        }
      });
  }

  addNewTask() {
    this.dialog
      .open(TaskDialogComponent, {
        width: '400px',
        data: { isEdit: false }
      })
      .afterClosed()
      .subscribe((newTask: any) => {
        if(newTask == "Closed")
          return;

        if (!newTask)
          return;

        this.taskService.addTask(newTask).subscribe({
          next: () => {
            this.loadTasks();
            this.snackBar.open(`Task added.`, 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open(`Failed to add task. Please try again.`, 'Close', { duration: 3000 });
          }
        });
      });
  }

  applyTaskChanges(updated: Task) {
    this.taskService.updateTask(updated).subscribe({
      next: () => {
        this.loadTasks();
        this.snackBar.open(`Task updated.`, 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open(`Failed to edit task. Please try again.`, 'Close', { duration: 3000 });
      }
    });
  }

  getPriorityColor(priority: 'low' | 'medium' | 'high') {
    switch (priority) {
      case 'high':
        return { primary: '#e91e63', secondary: '#f8bbd0' };
      case 'medium':
        return { primary: '#ff9800', secondary: '#ffe0b2' };
      default:
        return { primary: '#4caf50', secondary: '#c8e6c9' };
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  previous() {
    switch (this.view) {
      case CalendarView.Month:
        this.updateViewDate(addMonths(this.viewDate, -1));
        return;
      case CalendarView.Week:
        this.updateViewDate(addWeeks(this.viewDate, -1));
        return;
      default:
        this.updateViewDate(addDays(this.viewDate, -1));
        return;
    }
  }

  updateViewDate(newDate: Date){
    let reload = false;
    if(newDate.getMonth() !== this.viewDate.getMonth())
      reload = true;

    this.viewDate = newDate;
    if(reload)
      this.loadTasks();
  }

  next() {
    switch (this.view) {
      case CalendarView.Month:
        this.updateViewDate(addMonths(this.viewDate, 1));
        return;
      case CalendarView.Week:
        this.updateViewDate(addWeeks(this.viewDate, 1));
        return;
      default:
        this.updateViewDate(addDays(this.viewDate, 1));
        return;
    }
  }

  today() {
    this.updateViewDate(new Date());
  }
}