import { TestBed } from '@angular/core/testing';
import { CommandRepository } from './command-repository';

class TestCommand {
  constructor(readonly payload: string) {}
}

describe('CommandRepository', () => {
  let repository: CommandRepository;

  beforeEach(() => {
    repository = TestBed.inject(CommandRepository);
  });

  describe('#persist', () => {
    it('should attach command metadata', () => {
      const command = new TestCommand('hello');

      expect(repository.hasId(command)).toBe(false);
      expect(repository.hasMetadata(command)).toBe(false);

      repository.persist(command, {
        sourceEventId: 1,
      });

      const metadata = repository.getMetadata(command);

      expect(repository.hasId(command)).toBe(true);
      expect(repository.hasMetadata(command)).toBe(true);

      expect(metadata?.id).toBe(1);
      expect(metadata?.sourceEventId).toBe(1);
    });

    it('should increment an ID for each new command', () => {
      const command1 = new TestCommand('hello1');
      const command2 = new TestCommand('hello2');

      repository.persist(command1);
      repository.persist(command2);

      expect(repository.getId(command1)).toBe(1);
      expect(repository.getId(command2)).toBe(2);
    });

    it('should skip already persisted command', () => {
      const command = new TestCommand('hello');

      expect(repository.hasId(command)).toBe(false);
      expect(repository.hasMetadata(command)).toBe(false);

      repository.persist(command, {
        sourceEventId: 1,
      });

      repository.persist(command, {
        sourceEventId: 2,
      });

      const metadata = repository.getMetadata(command);

      expect(repository.hasId(command)).toBe(true);
      expect(repository.hasMetadata(command)).toBe(true);

      expect(metadata?.id).toBe(1);
      expect(metadata?.sourceEventId).toBe(1);
    });
  });
});
