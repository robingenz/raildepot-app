import { Injectable } from '@angular/core';
import { FeedbackService } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  constructor(private readonly feedbackService: FeedbackService) {}

  public sendFeedback(): void {
    this.feedbackService.sendFeedback();
  }
}
