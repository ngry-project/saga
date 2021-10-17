import { TestBed } from '@angular/core/testing';
import { ObservableSpy } from '@ngry/rx';
import { IEvent } from './event';
import { EventBus } from './event-bus';

class TestEvent implements IEvent {
  constructor(readonly payload: string) {}
}

describe('EventBus', () => {
  let eventBus: EventBus;
  let eventsSpy: ObservableSpy<IEvent>;

  beforeEach(() => {
    eventBus = TestBed.inject(EventBus);
  });

  beforeEach(() => {
    eventsSpy = new ObservableSpy<IEvent>(eventBus.events$);
  });

  describe('#publish', () => {
    it('should publish event asynchronously', async () => {
      const event = new TestEvent('hello');
      const promise = eventBus.publish(event);

      expect(eventsSpy.values.length).toBe(0);

      await promise;

      expect(eventsSpy.values.length).toBe(1);
      expect(eventsSpy.values[0]).toBe(event);
    });
  });
});
