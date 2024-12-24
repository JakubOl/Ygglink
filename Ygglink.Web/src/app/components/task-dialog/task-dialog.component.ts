import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../services/task-service.service';
import { TaskItem } from '../../models/task';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
  standalone: false
})
export class TaskDialogComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      subtasks: this.fb.array([])
    });

    if (data.task) {
      this.isEditMode = true;
      this.loadTask(data.task);
    }
  }

  ngOnInit(): void { }

  get subtasks(): FormArray {
    return this.taskForm.get('subtasks') as FormArray;
  }

  addSubtask(): void {
    this.subtasks.push(this.fb.group({
      id: [0],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      isCompleted: [false]
    }));
  }

  removeSubtask(index: number): void {
    this.subtasks.removeAt(index);
  }

  loadTask(task: TaskItem): void {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate
    });

    if (task.subtasks) {
      task.subtasks.forEach(st => {
        this.subtasks.push(this.fb.group({
          id: [st.id],
          title: [st.title, [Validators.required, Validators.maxLength(100)]],
          isCompleted: [st.isCompleted]
        }));
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveTask(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const task: TaskItem = {
        guid: this.isEditMode && this.data.task ? this.data.task.guid : Guid.create().toString(),
        title: formValue.title,
        description: formValue.description,
        startDate: moment(formValue.startDate).format('YYYY-MM-DD'),
        endDate: moment(formValue.endDate).format('YYYY-MM-DD'),
        subtasks: formValue.subtasks.map((st: any) => ({
          title: st.title,
          isCompleted: st.isCompleted
        }))
      };

      if (this.isEditMode) {
        this.taskService.updateTask(task).subscribe({
          next: () => {
            this.snackBar.open('Task updated successfully!', 'Close', { duration: 3000 });
            this.dialogRef.close('refresh');
          },
          error: (err) => {
            this.snackBar.open('Failed to update task. Please try again.', 'Close', { duration: 3000 });
          }
        });
      } else {
        this.taskService.addTask(task).subscribe({
          next: () => {
            this.snackBar.open('Task added successfully!', 'Close', { duration: 3000 });
            this.dialogRef.close('refresh');
          },
          error: () => {
            console.error();
            this.snackBar.open('Failed to add task. Please try again.', 'Close', { duration: 3000 });
          }
        });
      }
    } else {
      this.taskForm.markAllAsTouched();
      this.snackBar.open('Please correct the errors in the form.', 'Close', { duration: 3000 });
    }
  }
}
