import { Injectable } from '@angular/core';
import { DialogService, RouterService } from '@app/core';
import { TranslocoService } from '@jsverse/transloco';
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
export class TaskUpsertPageService {
  #client = injectQueryClient();
  #mutation = injectMutation();
  #query = injectQuery();

  constructor(
    private readonly tasksService: TasksService,
    private readonly routerService: RouterService,
    private readonly dialogService: DialogService,
    private readonly translocoService: TranslocoService,
  ) {}

  public addTask(): MutationResult<void, Error, Omit<Task, 'id'>, unknown> {
    return this.#mutation({
      mutationFn: (task: Omit<Task, 'id'>) => this.tasksService.addTask(task),
      onSuccess: () => {
        void this.#client.invalidateQueries({ queryKey: ['tasks'] });
      },
    });
  }

  public updateTask(): MutationResult<void, Error, Task, unknown> {
    return this.#mutation({
      mutationFn: (task: Task) =>
        this.tasksService.updateTask(task.id, { ...task }),
      onSuccess: () => {
        void this.#client.invalidateQueries({ queryKey: ['tasks'] });
      },
    });
  }

  public getTaskById(
    id: string,
  ): Result<QueryObserverResult<Task | null, Error>> {
    return this.#query({
      queryKey: ['tasks', id],
      queryFn: () => this.tasksService.getTaskById(id),
      retry: false,
      throwOnError: true,
    });
  }

  public deleteTask(): MutationResult<void, Error, string, unknown> {
    return this.#mutation({
      mutationFn: (id: string) => this.tasksService.deleteTask(id),
      onSuccess: () => {
        void this.#client.invalidateQueries({ queryKey: ['tasks'] });
      },
    });
  }

  public async navigateToTaskListPage(): Promise<void> {
    // await this.routerService.navigateToTaskListPage({
    //   animationDirection: 'back',
    // });
  }

  public async presentUnsavedChangesAlert(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      void this.dialogService.presentAlert({
        header: this.translocoService.translate(
          'core.dialog.unsavedChanges.header',
        ),
        message: this.translocoService.translate(
          'core.dialog.unsavedChanges.message',
        ),
        buttons: [
          {
            text: this.translocoService.translate(
              'core.dialog.unsavedChanges.button.cancel',
            ),
            role: 'cancel',
            handler: (): void => {
              resolve(false);
            },
          },
          {
            text: this.translocoService.translate(
              'core.dialog.unsavedChanges.button.continue',
            ),
            role: 'destructive',
            handler: (): void => {
              resolve(true);
            },
          },
        ],
      });
    });
  }

  public throwTaskNotFoundError(): never {
    const message = this.translocoService.translate(
      'domain.tasks.message.error.notFound',
    );
    throw new Error(message);
  }
}
