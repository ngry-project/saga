import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IEvent } from '../event/event';
import { EventPublisher } from '../event/event-publisher.decorator';
import { SagaMetadata } from './saga-metadata';

class TestInitEvent implements IEvent {
  constructor(readonly payload: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestSaga {
  @EventPublisher()
  init$ = new BehaviorSubject(new TestInitEvent('tester'));
}

describe('SagaMetadata', () => {
  let saga: TestSaga;
  let metadata: SagaMetadata;

  beforeEach(() => {
    saga = TestBed.inject(TestSaga);
  });

  beforeEach(() => {
    metadata = SagaMetadata.of(saga.constructor.prototype);
  });

  describe('#of', () => {
    it('should read object metadata', () => {
      expect(metadata).toBeInstanceOf(SagaMetadata);
    });

    it('should read event publishers', () => {
      expect(metadata.eventPublishers.size).toBe(1);
      expect(metadata.eventPublishers.has('init$')).toBe(true);
    });
  });
});
