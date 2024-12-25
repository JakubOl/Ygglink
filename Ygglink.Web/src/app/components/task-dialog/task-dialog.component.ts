import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../models/task';
import { Guid } from "guid-typescript";

interface TaskDialogData {
  isEdit: boolean;
  task?: Task;
}

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
  standalone: false
})
export class TaskDialogComponent {
  isEdit = false;
  editTask?: Task;

  title = '';
  priority: 'low' | 'medium' | 'high' = 'low';

  startDate: Date = new Date();
  startTime: string = '09:00';

  endDate: Date = new Date();
  endTime: string = '10:00';

  weekdays = [
    { label: 'Sun', day: 0, selected: true },
    { label: 'Mon', day: 1, selected: true },
    { label: 'Tue', day: 2, selected: true },
    { label: 'Wed', day: 3, selected: true },
    { label: 'Thu', day: 4, selected: true },
    { label: 'Fri', day: 5, selected: true },
    { label: 'Sat', day: 6, selected: true }
  ];

  constructor(
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) {
    this.isEdit = data.isEdit;

    if (this.isEdit && data.task) {
      this.editTask = { ...data.task };
    } else {
      this.startDate = new Date();
      this.endDate = new Date();
    }
  }

  onSubmit() {
    if (this.isEdit && this.editTask) {
      this.dialogRef.close([this.editTask]);
      return;
    }

    const tasksToCreate: Task[] = [];

    const [startHour, startMin] = this.startTime.split(':').map(Number);
    const [endHour, endMin] = this.endTime.split(':').map(Number);

    const fromDate = new Date(this.startDate);
    const toDate = new Date(this.endDate);

    if (fromDate > toDate) {
      alert('Start date must be before end date.');
      return;
    }

    let currentDate = new Date(fromDate.getTime());

    while (currentDate <= toDate) {
      const dayOfWeek = currentDate.getDay();
      const isSelectedDay = this.weekdays.find(
        (w) => w.day === dayOfWeek && w.selected
      );
      if (isSelectedDay) {
        const start = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          startHour,
          startMin
        );
        const end = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          endHour,
          endMin
        );

        const newTask: Task = {
          id: Guid.create().toString(),
          title: this.title,
          start,
          end,
          priority: this.priority
        };
        tasksToCreate.push(newTask);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (!tasksToCreate.length) {
      const start = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth(),
        fromDate.getDate(),
        startHour,
        startMin
      );
      const end = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth(),
        fromDate.getDate(),
        endHour,
        endMin
      );
      tasksToCreate.push({
        id: Guid.create().toString(),
        title: this.title,
        start,
        end,
        priority: this.priority
      });
    }

    this.dialogRef.close(tasksToCreate);
  }

  onEditStartTimeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (!this.editTask) return;
  
    const [hours, minutes] = value.split(':').map(Number);
    const tempDate = new Date(this.editTask.start);
    tempDate.setHours(hours || 0);
    tempDate.setMinutes(minutes || 0);
    this.editTask.start = tempDate;
  }
  
  onEditEndTimeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (!this.editTask) return;
  
    const [hours, minutes] = value.split(':').map(Number);
    const tempDate = new Date(this.editTask.end || this.editTask.start);
    tempDate.setHours(hours || 0);
    tempDate.setMinutes(minutes || 0);
    this.editTask.end = tempDate;
  }

  onCancel() {
    this.dialogRef.close(undefined);
  }
}
