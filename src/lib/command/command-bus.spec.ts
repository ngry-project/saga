import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ObservableSpy } from '@ngry/rx';
import { ICommand } from './command';
import { ICommandHandler } from './command-handler';
import { CommandBus } from './command-bus';
import { CommandHandlerRegistrar } from './command-handler-registrar';

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

describe('CommandBus', () => {
  let commandBus: CommandBus;
  let commandsSpy: ObservableSpy<ICommand>;

  beforeEach(() => {
    commandBus = TestBed.inject(CommandBus);
  });

  beforeEach(() => {
    commandsSpy = new ObservableSpy(commandBus.commands$);
  });

  describe('#execute', () => {
    describe('when corresponding handler is bound', () => {
      let handler: ICommandHandler;
      let handlerRegistrar: CommandHandlerRegistrar;
      let executeSpy: jest.SpyInstance;
      let command: TestCommand;

      beforeEach(() => {
        handler = TestBed.inject(TestHandler);
        handlerRegistrar = TestBed.inject(CommandHandlerRegistrar);

        handlerRegistrar.register(handler);
      });

      beforeEach(async () => {
        command = new TestCommand('hello');

        executeSpy = jest.spyOn(handler, 'execute');

        await commandBus.execute(command);
      });

      it('should emit given command', () => {
        expect(commandsSpy.values).toStrictEqual([command]);
      });

      it('should execute the handler', () => {
        expect(executeSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('when corresponding handler is not bound', () => {
      let command: TestCommand;

      beforeEach(() => {
        command = new TestCommand('hello');
      });

      it('should throw an error', async () => {
        await expect(commandBus.execute(command)).rejects.toThrow('No corresponding handler found for command TestCommand');
      });
    });
  });
});
