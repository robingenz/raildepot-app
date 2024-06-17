import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from '@app/shared';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { add, chatbox } from 'ionicons/icons';
import { HomePageService } from '../../services';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    SharedModule,
    TranslocoPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonItem,
    IonIcon,
    IonLabel,
    IonList,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  constructor(private readonly homePageService: HomePageService) {
    addIcons({ add, chatbox });
  }

  public onSendFeedback(): void {
    this.homePageService.sendFeedback();
  }
}
