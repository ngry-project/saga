import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICommand } from './command';
import { ICommandHandler } from './command-handler';
import { CommandHandlerRegistry } from './command-handler-registry';

class TestContext {}

class TestCommand implements ICommand {
  constructor(readonly payload: string, readonly context = new TestContext()) {}
}

@Injectable({
  providedIn: 'root',
})
class TestHandler implements ICommandHandler<TestCommand> {
  executes = TestCommand;

  execute(command$: Observable<TestCommand>): Observable<unknown> {
    return command$.pipe(map((command) => command.payload));
  }
}

describe('CommandHandlerRegistry', () => {
  let registry: CommandHandlerRegistry;
  let handler: TestHandler;

  beforeEach(() => {
    registry = TestBed.inject(CommandHandlerRegistry);
    handler = TestBed.inject(TestHandler);
  });

  describe('#register', () => {
    beforeEach(() => {
      registry.register(handler);
    });

    describe('when command type does not have an corresponding handler yet', () => {
      it('should register the command handler', () => {
        expect(registry.resolve(new TestCommand('hello'))).toBeInstanceOf(TestHandler);
      });
    });

    describe('when command type already has an corresponding handler', () => {
      it('should throw an error', () => {
        expect(() => {
          registry.register(handler);
        }).toThrow('Command TestCommand already has a corresponding handler');
      });
    });
  });

  describe('#resolve', () => {
    describe('when command type does not have an corresponding handler', () => {
      it('should throw an error', () => {
        expect(() => {
          registry.resolve(new TestCommand('hello'));
        }).toThrow(`No corresponding handler found for command ${TestCommand.name}`);
      });
    });

    describe('when command type has an corresponding handler', () => {
      beforeEach(() => {
        registry.register(handler);
      });

      it('should return an instance of an corresponding command handler', () => {
        expect(registry.resolve(new TestCommand('hello'))).toBe(handler);
      });
    });
  });
});
