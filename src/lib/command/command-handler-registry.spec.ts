import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICommand } from './command';
import { ICommandHandler } from './command-handler';
import { CommandHandlerRegistry } from './command-handler-registry';

class TestCommand implements ICommand {
  constructor(
    readonly payload: string,
  ) {
  }
}

@Injectable({
  providedIn: 'root',
})
class TestHandler implements ICommandHandler<TestCommand> {
  executes = TestCommand;

  execute(command$: Observable<TestCommand>): Observable<unknown> {
    return command$.pipe(
      map(command => command.payload),
    );
  }
}

describe('CommandHandlerRegistry', () => {
  describe('#register', () => {
    let registry: CommandHandlerRegistry;
    let handler: TestHandler;

    beforeEach(() => {
      registry = TestBed.inject(CommandHandlerRegistry);
      handler = TestBed.inject(TestHandler);
    });

    beforeEach(() => {
      registry.register(handler);
    });

    it('should register command handler', () => {
      expect(registry.resolve(new TestCommand('hello'))).toBeInstanceOf(TestHandler);
    });

    it('should allow only one handler per command type', () => {
      expect(() => {
        registry.register(handler);
      }).toThrow('Command TestCommand already has a corresponding handler');
    });
  });
});
