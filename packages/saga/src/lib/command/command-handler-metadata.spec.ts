import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IEvent } from '../event/event';
import { ICommand } from './command';
import { CommandHandler } from './command-handler.decorator';
import { CommandHandlerMetadata } from './command-handler-metadata';

class TestCommand implements ICommand {
  constructor(readonly payload: string) {}
}

class TestDoneEvent implements IEvent {
  constructor(readonly result: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestSaga {
  @CommandHandler(TestCommand)
  test(command$: Observable<TestCommand>): Observable<IEvent> {
    return command$.pipe(map((command) => new TestDoneEvent('hello ' + command.payload)));
  }
}

describe('CommandHandlerMetadata', () => {
  let saga: TestSaga;
  let metadata: CommandHandlerMetadata;

  beforeEach(() => {
    saga = TestBed.inject(TestSaga);
  });

  beforeEach(() => {
    metadata = CommandHandlerMetadata.of(saga.constructor.prototype);
  });

  describe('#of', () => {
    it('should read command handlers', () => {
      expect(metadata.handlers.size).toBe(1);
      expect(metadata.handlers.has('test')).toBe(true);
      expect(metadata.handlers.get('test')).toBe(TestCommand);
    });
  });
});
