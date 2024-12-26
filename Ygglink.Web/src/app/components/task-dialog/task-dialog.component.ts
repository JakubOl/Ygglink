import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../models/task';
import { Guid } from "guid-typescript";
import { TaskService } from "../../services/task-service.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private taskService: TaskService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      startDate: [new Date(), [Validators.required]],
      endDate: [new Date(), [Validators.required]],
      startTime: ['09:00', [Validators.required]],
      endTime: ['10:00', [Validators.required]],
      priority: ['low', [Validators.required]],
    });
    this.isEditMode = data.isEdit;

    if (this.isEditMode && data.task)
      this.taskForm.patchValue(data.task);
  }

  onSubmit(): void {
    if (!this.taskForm.valid)
      return;

    const formValue = this.taskForm.value;

    const start = new Date(
      formValue.startDate.getFullYear(),
      formValue.startDate.getMonth(),
      formValue.startDate.getDate(),
      formValue.startTime.getHours(),
      formValue.startTime.getMinutes(),
    );
    const end = new Date(
      formValue.endDate.getFullYear(),
      formValue.endDate.getMonth(),
      formValue.endDate.getDate(),
      formValue.endTime.getHours(),
      formValue.endTime.getMinutes(),
    );

    const task: Task = {
      guid: this.isEditMode && this.data.task ? this.data.task.guid : Guid.create().toString(),
      title: formValue.title,
      startDate: start,
      endDate: end,
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