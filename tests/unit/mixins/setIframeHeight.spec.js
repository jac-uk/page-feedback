import setIframeHeight from '@/mixins/setIframeHeight';
import Vue from 'vue';

jest.mock('vue', () => {
  return {
    nextTick: jest.fn()
  };
});


/**
 * Allow us to mock the height of the <html> element
 */
Object.defineProperties(window.HTMLElement.prototype, {
  offsetHeight: {
    get: function() { return parseFloat(window.getComputedStyle(this).height) || 0; }
  },
});

/**
 * Helper function to make the current `document` object the specified height in pixels
 * @param height Number
 */
const setHtmlHeight = (height) => {
  const html = document.querySelector('html');
  html.style.height = height + 'px';
};

describe('mixins/setIframeHeight', () => {
  afterEach(() => {
    Vue.nextTick.mockClear();
  });

  it('exports an object', () => {
    expect(setIframeHeight).toBeInstanceOf(Object);
  });

  describe('Vue mixin', () => {
    it('sets a `mounted` lifecycle hook', () => {
      expect(setIframeHeight.mounted).toBeInstanceOf(Function);
    });

    it('sets an `updated` lifecycle hook', () => {
      expect(setIframeHeight.updated).toBeInstanceOf(Function);
    });

    it('`mounted` and `updated` hooks call the same function', () => {
      const mounted = setIframeHeight.mounted;
      const updated = setIframeHeight.updated;
      expect(mounted).toBe(updated);
    });

    it('sets no other options', () => {
      const properties = Object.getOwnPropertyNames(setIframeHeight);
      const expectedProperties = ['mounted', 'updated'];
      const unexpectedProperties = properties.filter(property => !expectedProperties.includes(property));
      expect(unexpectedProperties).toEqual([]);
    });
  });

  describe('when the `mounted`/`updated` lifecycle hook executes', () => {
    beforeEach(() => {
      window.parent.postMessage = jest.fn();
      setIframeHeight.mounted();
      setHtmlHeight(150);
    });

    it('waits for DOM updates to complete by using `Vue.nextTick`', () => {
      expect(Vue.nextTick).toHaveBeenCalledTimes(1);
      expect(Vue.nextTick).toHaveBeenCalledWith(expect.any(Function));
    });

    it('posts a message to the parent window object using `window.postMessage`', () => {
      expect(Vue.nextTick).toHaveBeenCalledWith(expect.any(Function));
      const nextTickCallback = Vue.nextTick.mock.calls[0][0];
      nextTickCallback();
      expect(window.parent.postMessage).toHaveBeenCalled();
    });
  });

  describe('the call to `window.postMessage`', () => {
    let call = {};
    beforeEach(() => {
      window.parent.postMessage = jest.fn();
      setIframeHeight.mounted();
      setHtmlHeight(150);
      const nextTickCallback = Vue.nextTick.mock.calls[0][0];
      nextTickCallback();
      call.message = window.parent.postMessage.mock.calls[0][0];
      call.targetOrigin = window.parent.postMessage.mock.calls[0][1];
    });

    describe('argument #1 (`message`)', () => {
      it('is an object', () => {
        expect(call.message).toBeInstanceOf(Object);
      });

      it('contains one key', () => {
        const keys = Object.getOwnPropertyNames(call.message);
        expect(keys).toHaveLength(1);
      });

      it('contains the key `setIframeHeight`', () => {
        expect(call.message.setIframeHeight).not.toBeUndefined();
      });

      it('the value of `setIframeHeight` is the current height of the <html> element', () => {
        const currentHeight = document.querySelector('html').offsetHeight;
        expect(call.message.setIframeHeight).toEqual(currentHeight);
      });
    });

    describe('argument #2 (`targetWindow`)', () => {
      it('is an asterisk ("*") to allow any parent window to receive the message regardless of its origin', () => {
        expect(call.targetOrigin).toBe('*');
      });
    });
  });

  const heights = [0, 50, 100, 375, 999];
  describe.each(heights)('different <html> page heights', (height) => {
    it(`when the page height is ${height}px, \`setIframeHeight\` is ${height}`, () => {
      setHtmlHeight(height);
      window.parent.postMessage = jest.fn();
      setIframeHeight.mounted();
      const nextTickCallback = Vue.nextTick.mock.calls[0][0];
      nextTickCallback();
      const message = window.parent.postMessage.mock.calls[0][0];

      expect(message.setIframeHeight).toEqual(height);
    });
  });
});
