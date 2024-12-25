import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import {
  CalendarEvent,
  CalendarView,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { addDays } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { Task } from '../../models/task';
import { Guid } from 'guid-typescript';

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
    },
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
    },
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
    },
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
    },
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
    },
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

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.events = this.tasks.map((task) => {
      return {
        id: task.id,
        title: task.title,
        start: new Date(task.start),
        end: task.end ? new Date(task.end) : undefined,
        color: this.getPriorityColor(task.priority),
        draggable: true,
        resizable: { beforeStart: true, afterEnd: true },
        meta: {
          priority: task.priority
        }
      };
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
        if (newTasks?.length) {
          newTasks.forEach((t) => this.tasks.push(t));
          this.loadEvents();
        }
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

  previousDay() {
    this.viewDate = addDays(this.viewDate, -1);
  }
  nextDay() {
    this.viewDate = addDays(this.viewDate, 1);
  }
  today() {
    this.viewDate = new Date();
  }
}