import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="task-form-card">
      <h3>New Task</h3>
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input 
            type="text" 
            id="title" 
            formControlName="title"
            placeholder="What needs to be done?"
          />
        </div>

        <div class="form-group">
          <label for="description">Description (optional)</label>
          <textarea 
            id="description" 
            formControlName="description"
            rows="3"
            placeholder="Details..."
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="priority">Priority</label>
            <select id="priority" formControlName="priority">
              <option value="low">Low</option>
              <option value="medium" selected>Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div class="form-group half">
             <label for="dueDate">Due Date</label>
             <input type="date" id="dueDate" formControlName="dueDate" />
          </div>
        </div>

        <button type="submit" [disabled]="taskForm.invalid">
          Add Task
        </button>
      </form>
    </div>
  `,
  styles: [`
    .task-form-card {
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 2rem;
    }

    h3 {
      margin-top: 0;
      margin-bottom: 2rem;
      font-size: 1.5rem;
      color: var(--primary-color);
    }

    .form-group {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    input, textarea, select {
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: #1a1a1a;
      outline: none;
      transition: all 0.3s;
    }

    input::placeholder, textarea::placeholder {
      color: #adb5bd;
    }

    input:focus, textarea:focus, select:focus {
      border-color: var(--primary-color);
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .half {
      flex: 1;
    }

    button {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border: none;
      border-radius: 12px;
      color: white;
      font-weight: 700;
      cursor: pointer;
      margin-top: 1rem;
      transition: transform 0.2s, opacity 0.2s;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      transform: scale(1.02);
      opacity: 0.9;
    }
  `]
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    priority: ['medium' as 'low' | 'medium' | 'high'],
    dueDate: [new Date().toISOString().split('T')[0]]
  });

  onSubmit() {
    if (this.taskForm.valid) {
      const val = this.taskForm.value;
      this.taskService.addTask({
        title: val.title!,
        description: val.description || '',
        priority: val.priority || 'medium',
        dueDate: val.dueDate ? new Date(val.dueDate) : new Date(),
        tags: []
      });
      this.taskForm.reset({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0]
      });
    }
  }
}
