import { Injectable } from '@angular/core';
import { RouterService } from '@app/core';
import {
  MutationResult,
  QueryObserverResult,
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@ngneat/query';
import { Result } from '@ngneat/query/lib/types';
import { Task } from '../../interfaces';
import { TasksService } from '../tasks/tasks.service';

@Injectable({
  providedIn: 'root',
})
export class TaskListPageService {
  #client = injectQueryClient();
  #mutation = injectMutation();
  #query = injectQuery();

  constructor(
    private readonly routerService: RouterService,
    private readonly tasksService: TasksService,
  ) {}

  public deleteTask(): MutationResult<void, Error, string, unknown> {
    return this.#mutation({
      mutationFn: (id: string) => this.tasksService.deleteTask(id),
      onSuccess: () => {
        void this.#client.invalidateQueries({ queryKey: ['tasks'] });
      },
    });
  }

  public getTasks(): Result<QueryObserverResult<Task[], Error>> {
    return this.#query({
      queryKey: ['tasks'],
      queryFn: () => this.tasksService.getTasks(),
      retry: false,
      throwOnError: true,
    });
  }

  public async navigateToTaskUpsertPage(taskId?: string): Promise<void> {
    await this.routerService.navigateToTaskUpsertPage(taskId);
  }
}
