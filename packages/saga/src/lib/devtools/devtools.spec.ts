import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ObservableSpy } from '@ngry/rx';
import { Message } from './message/message';
import { Devtools } from './devtools';
import { DEVTOOLS_ID } from './devtools.constants';

describe('Devtools', () => {
  let devtools: Devtools;
  let window: Window;

  beforeEach(() => {
    devtools = TestBed.inject(Devtools);
    window = TestBed.inject(DOCUMENT).defaultView as Window;
  });

  describe('#ready$', () => {
    let readySpy: ObservableSpy<void>;

    beforeEach(() => {
      readySpy = new ObservableSpy(devtools.ready$);
    });

    it('should emit when window receives a DEVTOOLS_READY message', async () => {
      window.postMessage(
        {
          source: DEVTOOLS_ID,
          type: 'DEVTOOLS_READY',
        },
        '*',
      );

      await readySpy.whenCount(1);

      expect(readySpy.values.length).toBe(1);
    });
  });

  describe('#message$', () => {
    let messageSpy: ObservableSpy<Message>;

    beforeEach(() => {
      messageSpy = new ObservableSpy(devtools.messages$);
    });

    it('should emit when window receives a DEVTOOLS_MESSAGE message', async () => {
      window.postMessage(
        {
          source: DEVTOOLS_ID,
          type: 'DEVTOOLS_MESSAGE',
          message: {
            type: 'SOME',
            payload: 'abc',
          },
        },
        '*',
      );

      await messageSpy.whenCount(1);

      expect(messageSpy.values.length).toBe(1);
      expect(messageSpy.values).toEqual([
        {
          type: 'SOME',
          payload: 'abc',
        },
      ]);
    });
  });

  describe('#send', () => {
    beforeEach(() => {
      jest.spyOn(window, 'postMessage');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should post a CLIENT_MESSAGE via window object', () => {
      devtools.send({
        type: 'SOME',
        payload: 'abc',
      });

      expect(window.postMessage).toHaveBeenCalledTimes(1);
      expect(window.postMessage).toHaveBeenLastCalledWith(
        {
          source: DEVTOOLS_ID,
          type: 'CLIENT_MESSAGE',
          message: {
            type: 'SOME',
            payload: 'abc',
          },
        },
        '*',
      );
    });
  });
});
