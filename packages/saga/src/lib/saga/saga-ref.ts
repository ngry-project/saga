import { Subscription, Unsubscribable } from 'rxjs';

export class SagaRef {
  private readonly subscription: Subscription;

  constructor(...subscriptions: Array<Unsubscribable>) {
    this.subscription = new Subscription();

    for (const _subscription of subscriptions) {
      this.subscription.add(_subscription);
    }
  }

  dispose(): void {
    this.subscription.unsubscribe();
  }
}
