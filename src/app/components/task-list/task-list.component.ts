import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-list">
      @for (task of taskService.tasks(); track task.id) {
        <div class="task-card" [class.completed]="task.completed">
          <div class="task-header">
            <input 
              type="checkbox" 
              [checked]="task.completed"
              (change)="taskService.toggleTaskCompletion(task.id)"
            />
            <h3>{{ task.title }}</h3>
            <span class="priority-badge" [class]="task.priority">
              {{ task.priority }}
            </span>
          </div>
          <p>{{ task.description }}</p>
          <div class="task-footer">
            <small>{{ task.dueDate | date:'shortDate' }}</small>
            <button class="delete-btn" (click)="taskService.deleteTask(task.id)">
              <i class="icon-trash"></i>
            </button>
          </div>
        </div>
      } @empty {
        <div class="empty-state">
           <img src="assets/images/empty_tasks.png" alt="No tasks" style="max-width: 200px; margin-bottom: 1rem;" />
           <p>Your task list is empty. Start by adding one!</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .task-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      padding: 1rem;
    }
    
    .task-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.25rem;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      position: relative;
    }
    
    .task-card:hover {
      transform: translateY(-5px);
      border-color: var(--primary-color);
      box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }
    
    .task-card.completed {
      opacity: 0.5;
      text-decoration: line-through;
    }
    
    .task-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    
    .priority-badge {
      font-size: 0.7rem;
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      text-transform: uppercase;
      font-weight: bold;
    }
    
    .priority-badge.low { background: #34c759; color: white; }
    .priority-badge.medium { background: #ff9500; color: white; }
    .priority-badge.high { background: #ff3b30; color: white; }
    
    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      border-top: 1px solid var(--border-color);
      padding-top: 0.75rem;
    }
    
    .delete-btn {
      background: none;
      border: none;
      color: #ff3b30;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    
    .delete-btn:hover {
      opacity: 1;
    }
    
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: var(--gray-400);
    }
  `]
})
export class TaskListComponent {
  protected taskService = inject(TaskService);
}
