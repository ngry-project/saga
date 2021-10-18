import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IEvent } from './event';
import { EventPublisher } from './event-publisher.decorator';
import { EventPublisherMetadata } from './event-publisher-metadata';

class InitEvent implements IEvent {
  constructor(readonly payload: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestSaga {
  @EventPublisher()
  init$ = new BehaviorSubject(new InitEvent('tester'));
}

describe('EventPublisherMetadata', () => {
  let saga: TestSaga;
  let metadata: EventPublisherMetadata;

  beforeEach(() => {
    saga = TestBed.inject(TestSaga);
  });

  beforeEach(() => {
    metadata = EventPublisherMetadata.of(saga.constructor.prototype);
  });

  describe('#of', () => {
    it('should read object metadata', () => {
      expect(metadata).toBeInstanceOf(EventPublisherMetadata);
    });

    it('should read event publishers', () => {
      expect(metadata.publishers.size).toBe(1);
      expect(metadata.publishers.has('init$')).toBe(true);
    });
  });
});
