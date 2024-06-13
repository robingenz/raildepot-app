import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { nanoid } from 'nanoid';
import { Task } from '../../interfaces';
import { TasksLocalStorageService } from '../tasks-local-storage/tasks-local-storage.service';
import { TasksSqliteService } from '../tasks-sqlite/tasks-sqlite.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(
    private readonly tasksSqliteService: TasksSqliteService,
    private readonly tasksLocalStorageService: TasksLocalStorageService,
  ) {}

  public async addTask(options: Omit<Task, 'id'>): Promise<void> {
    const task: Task = {
      ...options,
      id: nanoid(),
    };
    const isWeb = Capacitor.getPlatform() === 'web';
    if (isWeb) {
      await this.tasksLocalStorageService.insertTask(task);
    } else {
      await this.tasksSqliteService.insertTask(task);
    }
  }

  public getTasks(): Promise<Task[]> {
    const isWeb = Capacitor.getPlatform() === 'web';
    if (isWeb) {
      return this.tasksLocalStorageService.selectTasks();
    } else {
      return this.tasksSqliteService.selectTasks();
    }
  }

  public getTaskById(id: Task['id']): Promise<Task | null> {
    const isWeb = Capacitor.getPlatform() === 'web';
    if (isWeb) {
      return this.tasksLocalStorageService.selectTaskById(id);
    } else {
      return this.tasksSqliteService.selectTaskById(id);
    }
  }

  public async updateTask(
    id: Task['id'],
    options: Omit<Task, 'id'>,
  ): Promise<void> {
    const isWeb = Capacitor.getPlatform() === 'web';
    if (isWeb) {
      await this.tasksLocalStorageService.updateTask(id, options);
    } else {
      await this.tasksSqliteService.updateTask(id, options);
    }
  }

  public async deleteTask(id: Task['id']): Promise<void> {
    const isWeb = Capacitor.getPlatform() === 'web';
    if (isWeb) {
      await this.tasksLocalStorageService.deleteTask(id);
    } else {
      await this.tasksSqliteService.deleteTask(id);
    }
  }
}
