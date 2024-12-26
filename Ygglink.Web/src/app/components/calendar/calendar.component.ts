import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarEventTimesChangedEvent } from 'angular-calendar';
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
    this.loadEvents();
  }

  loadEvents(): void {
    const month = moment(this.viewDate).format('YYYY-MM');

    this.taskService
      .getTasks(month)
      .subscribe(tasks => {
        this.tasks = tasks;
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
          this.loadEvents();
          return;
        }

        if (updatedTask) {
          this.applyTaskChanges(updatedTask[0]);
        }
      });
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    const foundIndex = this.tasks.findIndex((t) => t.guid === event.id);
    if (foundIndex !== -1) {
      this.tasks[foundIndex].startDate = newStart;
      this.tasks[foundIndex].endDate = newEnd || undefined;
      this.loadEvents();
    }
  }

  addNewTask() {
    this.dialog
      .open(TaskDialogComponent, {
        width: '400px',
        data: { isEdit: false }
      })
      .afterClosed()
      .subscribe((newTasks: Task[] | undefined) => {
        if (!newTasks?.length)
          return;

        this.taskService.addTasks(newTasks).subscribe({
          next: () => {
            this.loadEvents();
            this.snackBar.open(`Task added.`, 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open(`Failed to add tasks. Please try again.`, 'Close', { duration: 3000 });
          }
        });
      });
  }

  applyTaskChanges(updated: Task) {
    this.taskService.updateTask(updated).subscribe({
      next: () => {
        this.loadEvents();
        this.snackBar.open(`Task updated.`, 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open(`Failed to edit tasks. Please try again.`, 'Close', { duration: 3000 });
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
        this.viewDate = addMonths(this.viewDate, -1);
        return;
      case CalendarView.Week:
        this.viewDate = addWeeks(this.viewDate, -1);
        return;
      default:
        this.viewDate = addDays(this.viewDate, -1);
        return;
    }
  }

  next() {
    switch (this.view) {
      case CalendarView.Month:
        this.viewDate = addMonths(this.viewDate, 1);
        return;
      case CalendarView.Week:
        this.viewDate = addWeeks(this.viewDate, 1);
        return;
      default:
        this.viewDate = addDays(this.viewDate, 1);
        return;
    }
  }

  today() {
    this.viewDate = new Date();
  }
}