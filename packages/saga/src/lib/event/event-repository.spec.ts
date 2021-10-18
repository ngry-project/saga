import { TestBed } from '@angular/core/testing';
import { EventRepository } from './event-repository';

class TestEvent {
  constructor(readonly payload: string) {}
}

describe('EventRepository', () => {
  let repository: EventRepository;

  beforeEach(() => {
    repository = TestBed.inject(EventRepository);
  });

  describe('#persist', () => {
    it('should attach event metadata', () => {
      const event = new TestEvent('hello');

      expect(repository.hasId(event)).toBe(false);
      expect(repository.hasMetadata(event)).toBe(false);

      repository.persist(event, {
        sourceCommandId: 1,
      });

      const metadata = repository.getMetadata(event);

      expect(repository.hasId(event)).toBe(true);
      expect(repository.hasMetadata(event)).toBe(true);

      expect(metadata?.id).toBe(1);
      expect(metadata?.sourceCommandId).toBe(1);
    });

    it('should increment an ID for each new event', () => {
      const event1 = new TestEvent('hello1');
      const event2 = new TestEvent('hello2');

      repository.persist(event1);
      repository.persist(event2);

      expect(repository.getId(event1)).toBe(1);
      expect(repository.getId(event2)).toBe(2);
    });

    it('should skip already persisted event', () => {
      const event = new TestEvent('hello');

      expect(repository.hasId(event)).toBe(false);
      expect(repository.hasMetadata(event)).toBe(false);

      repository.persist(event, {
        sourceCommandId: 1,
      });

      repository.persist(event, {
        sourceCommandId: 2,
      });

      const metadata = repository.getMetadata(event);

      expect(repository.hasId(event)).toBe(true);
      expect(repository.hasMetadata(event)).toBe(true);

      expect(metadata?.id).toBe(1);
      expect(metadata?.sourceCommandId).toBe(1);
    });
  });
});
