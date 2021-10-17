import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICommand } from './command';
import { ICommandHandler } from './command-handler';
import { CommandHandlerRegistry } from './command-handler-registry';
import { IEvent } from '../event/event';

class TestCommand implements ICommand {
  constructor(readonly payload: string) {}
}

class TestDoneEvent implements IEvent {
  constructor(readonly payload: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestHandler implements ICommandHandler<TestCommand> {
  executes = TestCommand;

  execute(command$: Observable<TestCommand>): Observable<IEvent> {
    return command$.pipe(map(() => new TestDoneEvent('world')));
  }
}

describe('CommandHandlerRegistry', () => {
  let registry: CommandHandlerRegistry;
  let handler: TestHandler;

  beforeEach(() => {
    registry = TestBed.inject(CommandHandlerRegistry);
    handler = TestBed.inject(TestHandler);
  });

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#register', () => {
    beforeEach(() => {
      registry.register(handler);
    });

    describe('when command type does not have a corresponding handler yet', () => {
      it('should increase size of the command handler registry', () => {
        expect(registry.length).toBe(1);
      });

      it('should register the command handler', () => {
        expect(registry.resolve(new TestCommand('hello'))).toBeInstanceOf(TestHandler);
      });
    });

    describe('when command type already has a corresponding handler', () => {
      it('should throw an error', () => {
        expect(() => {
          registry.register(handler);
        }).toThrow('Command TestCommand already has a corresponding handler');
      });
    });
  });

  describe('#unregister', () => {
    describe('when the command handler is not registered', () => {
      it('should throw an error', () => {
        expect(() => {
          registry.unregister(handler);
        }).toThrow(`Command handler for TestCommand is not registered`);
      });
    });

    describe('when the command handler is registered', () => {
      beforeEach(() => {
        registry.register(handler);
      });

      beforeEach(() => {
        registry.unregister(handler);
      });

      it('should decrease size of the command handler registry', () => {});

      it('should delete the command handler from the registry', () => {
        expect(() => {
          registry.resolve(new TestCommand('hello'));
        }).toThrow(`No corresponding handler found for command ${TestCommand.name}`);
      });
    });
  });

  describe('#resolve', () => {
    describe('when command type does not have a corresponding handler', () => {
      it('should throw an error', () => {
        expect(() => {
          registry.resolve(new TestCommand('hello'));
        }).toThrow(`No corresponding handler found for command ${TestCommand.name}`);
      });
    });

    describe('when command type has a corresponding handler', () => {
      beforeEach(() => {
        registry.register(handler);
      });

      it('should return an instance of a corresponding command handler', () => {
        expect(registry.resolve(new TestCommand('hello'))).toBe(handler);
      });
    });
  });
});
