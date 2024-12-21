import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { CalendarDay } from '../../models/calendarday';
import { TaskService } from '../../services/task-service.service';
import { TaskItem } from '../../models/task';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { Subtask } from '../../models/subtask';

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  currentDate: moment.Moment = moment();
  weeks: CalendarDay[][] = [];
  isLoading: boolean = false;

  constructor(private taskService: TaskService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    this.isLoading = true;
    const startOfMonth = this.currentDate.clone().startOf('month');
    const endOfMonth = this.currentDate.clone().endOf('month');

    const startDate = startOfMonth.clone().startOf('week');
    const endDate = endOfMonth.clone().endOf('week');

    const month = this.currentDate.format('YYYY-MM');

    this.taskService.getTasks(month).subscribe({
      next: (tasks) => {
        let current = startDate.clone();
        const weeks: CalendarDay[][] = [];

        while (current.isBefore(endDate, 'day')) {
          const week: CalendarDay[] = [];
          for (let i = 0; i < 7; i++) {
            const date = current.clone();
            const dayTasks = tasks.filter(task => moment(task.date).isSame(date, 'day'));
            week.push({
              date: date.toDate(),
              tasks: dayTasks,
              dayNumber: date.date(),
              isCurrentMonth: date.month() === this.currentDate.month()
            });
            current.add(1, 'day');
          }
          weeks.push(week);
        }

        this.weeks = weeks;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  prevMonth(): void {
    this.currentDate = this.currentDate.subtract(1, 'month');
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = this.currentDate.add(1, 'month');
    this.generateCalendar();
  }

  openAddTaskDialog(date: Date, task?: TaskItem): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { date, task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.generateCalendar();
      }
    });
  }

  deleteTask(task: TaskItem): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(task.guid).subscribe({
        next: () => this.generateCalendar(),
        error: (err) => console.error(err)
      });
    }
  }

  toggleSubtaskCompletion(task: TaskItem, subtask: Subtask): void {
    // Toggle isCompleted and update the task
    if (task.subtasks) {
      const updatedSubtasks = task.subtasks.map(st => {
        if (st.id === subtask.id) {
          return { ...st, isCompleted: !st.isCompleted };
        }
        return st;
      });
      const updatedTask: TaskItem = { ...task, subtasks: updatedSubtasks };
      this.taskService.updateTask(updatedTask).subscribe({
        next: () => this.generateCalendar(),
        error: (err) => console.error(err)
      });
    }
  }
}
