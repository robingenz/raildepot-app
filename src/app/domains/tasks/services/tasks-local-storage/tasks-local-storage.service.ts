import { Injectable } from '@angular/core';
import { CapacitorPreferencesService } from '@app/core';
import { Task } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TasksLocalStorageService {
  private readonly key = 'tasks';

  constructor(
    private readonly capacitorPreferencesService: CapacitorPreferencesService,
  ) {}

  public async deleteTask(id: Task['id']): Promise<void> {
    const tasks = await this.selectTasks();
    const newTasks = tasks.filter(task => task.id !== id);
    await this.capacitorPreferencesService.set({
      key: this.key,
      value: JSON.stringify(newTasks),
    });
  }

  public async insertTask(options: Task): Promise<void> {
    const tasks = await this.selectTasks();
    tasks.push(options);
    await this.capacitorPreferencesService.set({
      key: this.key,
      value: JSON.stringify(tasks),
    });
  }

  public async selectTasks(): Promise<Task[]> {
    const result = await this.capacitorPreferencesService.get({
      key: this.key,
    });
    return result.value ? JSON.parse(result.value) : [];
  }

  public async selectTaskById(id: Task['id']): Promise<Task | null> {
    const tasks = await this.selectTasks();
    const foundTask = tasks.find(task => task.id === id);
    return foundTask || null;
  }

  public async updateTask(
    id: Task['id'],
    options: Omit<Task, 'id'>,
  ): Promise<void> {
    const tasks = await this.selectTasks();
    const foundTaskIndex = tasks.findIndex(task => task.id === id);
    if (foundTaskIndex === -1) {
      return;
    }
    tasks[foundTaskIndex] = {
      ...tasks[foundTaskIndex],
      ...options,
    };
    await this.capacitorPreferencesService.set({
      key: this.key,
      value: JSON.stringify(tasks),
    });
  }
}
