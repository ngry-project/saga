import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IEvent } from './event';
import { EventListener } from './event-listener.decorator';
import { EventListenerMetadata } from './event-listener-metadata';

class InitEvent implements IEvent {
  constructor(readonly payload: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestSaga {
  @EventListener(InitEvent)
  onInit(event: InitEvent) {
    return event;
  }
}

describe('EventListenerMetadata', () => {
  let saga: TestSaga;
  let metadata: EventListenerMetadata;

  beforeEach(() => {
    saga = TestBed.inject(TestSaga);
  });

  beforeEach(() => {
    metadata = EventListenerMetadata.of(saga.constructor.prototype);
  });

  describe('#of', () => {
    it('should read object metadata', () => {
      expect(metadata).toBeInstanceOf(EventListenerMetadata);
    });

    it('should read event publishers', () => {
      expect(metadata.listeners.size).toBe(1);
      expect(metadata.listeners.has('onInit')).toBe(true);
      expect(metadata.listeners.get('onInit')).toBe(InitEvent);
    });
  });
});
