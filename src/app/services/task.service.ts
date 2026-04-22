import { Injectable, signal, computed } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private _tasks = signal<Task[]>(this.loadFromLocalStorage());

  // Selectors
  readonly tasks = this._tasks.asReadonly();
  
  readonly completedTasks = computed(() => 
    this._tasks().filter(task => task.completed)
  );

  readonly pendingTasksCount = computed(() => 
    this._tasks().filter(task => !task.completed).length
  );

  constructor() {
    // Save to localStorage whenever tasks change
    // Using an effect would be better, but let's stick to simple for now if possible
    // or just manual save on each mutation.
  }

  addTask(task: Omit<Task, 'id' | 'completed' | 'dueDate'> & { dueDate?: Date }) {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      completed: false,
      dueDate: task.dueDate || new Date(),
      tags: task.tags || []
    };
    
    this._tasks.update(tasks => [...tasks, newTask]);
    this.saveToLocalStorage();
  }

  updateTask(id: number, updates: Partial<Task>) {
    this._tasks.update(tasks => 
      tasks.map(task => task.id === id ? { ...task, ...updates } : task)
    );
    this.saveToLocalStorage();
  }

  toggleTaskCompletion(id: number) {
    this._tasks.update(tasks => 
      tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task)
    );
    this.saveToLocalStorage();
  }

  deleteTask(id: number) {
    this._tasks.update(tasks => tasks.filter(task => task.id !== id));
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this._tasks()));
  }

  private loadFromLocalStorage(): Task[] {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        return parsedTasks.map((t: any) => ({
          ...t,
          dueDate: new Date(t.dueDate)
        }));
      } catch (e) {
        return this.getDefaultTasks();
      }
    }
    return this.getDefaultTasks();
  }

  private getDefaultTasks(): Task[] {
    return [
      {
        id: 1,
        title: 'Complete Angular Workshop',
        description: 'Finish all modules from the Angular 101 workshop and build TaskManager Pro.',
        priority: 'high',
        dueDate: new Date(),
        completed: false,
        tags: ['Angular', 'Learning']
      },
      {
        id: 2,
        title: 'Walk the dog',
        description: 'Takes Rex for a long walk in the park.',
        priority: 'low',
        dueDate: new Date(),
        completed: true,
        tags: ['Personal']
      }
    ];
  }
}
