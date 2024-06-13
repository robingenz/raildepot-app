import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from '@app/shared';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { add, trash } from 'ionicons/icons';
import { Task } from '../../interfaces';
import { TaskListPageService } from '../../services';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
  standalone: true,
  imports: [
    SharedModule,
    AsyncPipe,
    DatePipe,
    TranslocoPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItemSliding,
    IonItem,
    IonLabel,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonFab,
    IonFabButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListPage {
  public readonly tasks = this.taskListPageService.getTasks().result;

  private readonly deleteTask = this.taskListPageService.deleteTask();

  constructor(private readonly taskListPageService: TaskListPageService) {
    addIcons({ trash, add });
  }

  public async onDeleteTask(task: Task): Promise<void> {
    this.deleteTask.mutate(task.id);
  }

  public async onNavigateToTaskUpsertPage(task?: Task): Promise<void> {
    await this.taskListPageService.navigateToTaskUpsertPage(task?.id);
  }
}
