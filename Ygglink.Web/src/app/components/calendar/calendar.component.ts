import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { addDays, addMonths, addWeeks } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { Task } from '../../models/task';
import { Guid } from 'guid-typescript';
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

  tasks: Task[] = [
    {
      id: Guid.create().toString(),
      title: 'Project Meeting',
      start: new Date(2024, 11, 12, 9, 0),
      end: new Date(2024, 11, 12, 10, 0),
      priority: 'high'
    },
    {
      id: Guid.create().toString(),
      title: 'Buy Groceries',
      start: new Date(2024, 11, 12, 17, 0),
      end: new Date(2024, 11, 12, 18, 0),
      priority: 'medium'
    }
  ];

  events: CalendarEvent[] = [];

  constructor(private dialog: MatDialog, private taskService: TaskService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const month = moment(this.viewDate).format('YYYY-MM');

    this.taskService.getTasks(month).subscribe(tasks => {
      this.events = tasks.map((task) => {
        return {
          id: task.id,
          title: task.title,
          start: new Date(task.start),
          end: task.end ? new Date(task.end) : undefined,
          color: this.getPriorityColor(task.priority),
          draggable: false,
          resizable: { beforeStart: true, afterEnd: true },
          meta: {
            priority: task.priority
          }
        };
      });
    });
    this.refresh.next(null);
  }

  eventClicked(event: CalendarEvent) {
    const task = this.tasks.find((t) => t.id === event.id);
    if (!task)
      return;

    this.dialog
      .open(TaskDialogComponent, {
        width: '400px',
        data: { isEdit: true, task: { ...task } }
      })
      .afterClosed()
      .subscribe((updatedTask: Task[] | undefined) => {
        if (updatedTask) {
          this.applyTaskChanges(updatedTask[0]);
        }
      });
  }
  removeTask(updatedTask: string) {
    throw new Error('Method not implemented.');
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    const foundIndex = this.tasks.findIndex((t) => t.id === event.id);
    if (foundIndex !== -1) {
      this.tasks[foundIndex].start = newStart;
      this.tasks[foundIndex].end = newEnd || undefined;
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
          next: () => this.loadEvents(),
          error: () => {
            this.snackBar.open(`Failed to add tasks. Please try again.`, 'Close', { duration: 3000 });
          }
        });
      });
  }

  applyTaskChanges(updated: Task) {
    const index = this.tasks.findIndex((t) => t.id === updated.id);
    if (index !== -1) {
      this.tasks[index] = updated;
      this.loadEvents();
    }
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