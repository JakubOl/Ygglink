import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../models/task';
import { Guid } from "guid-typescript";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';

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
  isEditMode = false;
  taskForm: FormGroup;

  title = '';
  priority: 'low' | 'medium' | 'high' = 'low';

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData,
    private fb: FormBuilder,
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      startDate: [new Date(), [Validators.required]],
      endDate: [new Date(), [Validators.required]],
      startTime: [moment(new Date()).format("YYYY-MM-DDT09:00:00"), [Validators.required]],
      endTime: [moment(new Date()).format("YYYY-MM-DDT10:00:00"), [Validators.required]],
      priority: ['low', [Validators.required]],
    });

    this.isEditMode = data.isEdit;

    if (this.isEditMode && data.task){
      this.taskForm.patchValue({
        title: data.task.title,
        startDate: data.task.startDate,
        endDate: data.task.endDate,
        startTime: moment(data.task.startDate).format("YYYY-MM-DDTHH:mm:00"),
        endTime: moment(data.task.endDate).format("YYYY-MM-DDTHH:mm:00"),
        priority: data.task.priority,
      });
    }
  }

  onSubmit(): void {
    if (!this.taskForm.valid)
      return;

    const formValue = this.taskForm.value;

    const start = new Date(formValue.startDate);
    const end = new Date(formValue.endDate);
    
    const startTime = new Date(formValue.startTime);
    const endTime = new Date(formValue.endTime);
    
    start.setHours(startTime.getHours());
    start.setMinutes(startTime.getMinutes());
    
    end.setHours(endTime.getHours());
    end.setMinutes(endTime.getMinutes());

    const task: Task = {
      guid: this.isEditMode && this.data.task ? this.data.task.guid : Guid.create().toString(),
      title: formValue.title,
      startDate: moment(start).format("YYYY-MM-DDTHH:mm:ss"),
      endDate: moment(end).format("YYYY-MM-DDTHH:mm:ss"),
      priority: formValue.priority,
    };

    this.dialogRef.close(task);
  }

  onCancel() {
    this.dialogRef.close("Closed");
  }

  onDelete(){
    this.dialogRef.close("Deleted");
  }
}