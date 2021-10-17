import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICommand } from '../command/command';
import { IEvent } from '../event/event';
import { EventHandler } from '../event/event-handler.decorator';
import { EventPublisher } from '../event/event-publisher.decorator';
import { SagaMetadata } from './saga-metadata';

class TestInitEvent implements IEvent {
  constructor(readonly payload: string) {}
}

class TestCommand implements ICommand {
  constructor(readonly payload: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestSaga {
  @EventPublisher()
  init$ = new BehaviorSubject(new TestInitEvent('tester'));

  @EventHandler(TestInitEvent)
  init(event$: Observable<TestInitEvent>): Observable<ICommand> {
    return event$.pipe(map((event) => new TestCommand(event.payload)));
  }
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

    it('should read event handlers', () => {
      expect(metadata.eventHandlers.size).toBe(1);
      expect(metadata.eventHandlers.has('init')).toBe(true);
    });
  });
});
