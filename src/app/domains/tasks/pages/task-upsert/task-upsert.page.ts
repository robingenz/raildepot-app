import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '@app/shared';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { add, cloudDownload, document, trash } from 'ionicons/icons';
import { Task } from '../../interfaces';
import { TaskUpsertPageService } from '../../services';

@Component({
  selector: 'app-task-upsert',
  templateUrl: './task-upsert.page.html',
  styleUrls: ['./task-upsert.page.scss'],
  standalone: true,
  imports: [
    SharedModule,
    TranslocoPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonTextarea,
    IonToggle,
    IonDatetime,
    IonItemSliding,
    IonIcon,
    IonLabel,
    IonSpinner,
    IonItemOptions,
    IonItemOption,
    IonBackButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskUpsertPage {
  public readonly taskId = this.activatedRoute.snapshot.params['id'];
  public readonly form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    dueDate: new FormControl<string | null>(null),
  });

  private readonly addTask = this.taskUpsertPageService.addTask();
  private readonly updateTask = this.taskUpsertPageService.updateTask();
  private readonly deleteTask = this.taskUpsertPageService.deleteTask();
  private readonly task = this.taskId
    ? this.taskUpsertPageService.getTaskById(this.taskId).result
    : signal(undefined);

  constructor(
    private readonly taskUpsertPageService: TaskUpsertPageService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    addIcons({ document, cloudDownload, trash, add });
    effect(() => {
      const task = this.task()?.data;
      if (task === null) {
        void this.throwErrorAndNavigateToTaskListPage();
      } else {
        this.patchFormValue(task);
      }
    });
  }

  public async canDeactivate(): Promise<boolean> {
    if (!this.form.dirty) {
      return true;
    }
    return this.taskUpsertPageService.presentUnsavedChangesAlert();
  }

  public async onDeleteTask(): Promise<void> {
    const task = this.task()?.data;
    if (!task) {
      return;
    }
    await this.deleteTask.mutateAsync(task.id);
    this.form.markAsPristine();
    await this.taskUpsertPageService.navigateToTaskListPage();
  }

  public async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      return;
    }
    const task = this.task()?.data;
    const options: Omit<Task, 'id'> = {
      title: this.form.value.title || '',
      description: this.form.value.description || null,
      dueDate: this.form.value.dueDate || null,
      createdAt: task ? task.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (task) {
      await this.updateTask.mutateAsync({
        id: task?.id,
        ...options,
      });
    } else {
      await this.addTask.mutateAsync(options);
    }
    this.form.markAsPristine();
    await this.taskUpsertPageService.navigateToTaskListPage();
  }

  public onToggleDueDateEnabled(): void {
    this.form.patchValue({
      dueDate: this.form.value.dueDate ? null : new Date().toISOString(),
    });
    this.form.markAsDirty();
  }

  private patchFormValue(task: Task | undefined): void {
    this.form.patchValue({
      title: task?.title,
      description: task?.description,
      dueDate: task?.dueDate,
    });
    this.changeDetectorRef.markForCheck();
  }

  private throwErrorAndNavigateToTaskListPage(): void {
    void this.taskUpsertPageService.navigateToTaskListPage();
    this.taskUpsertPageService.throwTaskNotFoundError();
  }
}
