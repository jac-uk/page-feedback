import {shallowMount} from '@vue/test-utils';
import App from '@/App';
import FeedbackForm from '@/components/FeedbackForm';
import {firestore} from '@/firebase';

jest.mock('@/firebase', () => {
  const firebase = require('firebase-mock');
  const firestore = firebase.MockFirebaseSdk().firestore();
  firestore.autoFlush();
  return {firestore};
});

const deleteCollection = async (collectionPath) => {
  const records = await firestore.collection(collectionPath).get();
  const deletes = records.docs.map(snapshot => snapshot.ref.delete());
  await Promise.all(deletes);
};

describe('App', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(App);
  });

  describe('in its initial state', () => {
    it('renders the `FeedbackForm` component', () => {
      expect(wrapper.find(FeedbackForm).exists()).toBe(true);
    });

    it('calls `saveFeedback` when `FeedbackForm` emits `submit` event', () => {
      const submitPayload = {
        useful: false,
        reason: 'I don’t understand',
        comments: 'The content is too wordy. Please make it easier to understand.',
      };
      const mockSaveFeedback = jest.fn().mockResolvedValue(undefined);
      wrapper.setMethods({saveFeedback: mockSaveFeedback});
      wrapper.find(FeedbackForm).vm.$emit('submit', submitPayload);
      expect(wrapper.vm.saveFeedback).toHaveBeenCalledTimes(1);
      expect(wrapper.vm.saveFeedback).toHaveBeenCalledWith(submitPayload);
    });
  });

  describe('when `submitted` is `true`', () => {
    beforeEach(() => {
      wrapper.setData({submitted: true});
    });

    it("doesn't render the `FeedbackForm` component", () => {
      expect(wrapper.find(FeedbackForm).exists()).toBe(false);
    });

    it('shows "Is this page useful?" styled as a fieldset legend', () => {
      const legend = wrapper.find('.govuk-fieldset__legend');
      expect(legend.exists()).toBe(true);
      expect(legend.text()).toBe('Is this page useful?');
    });

    it('shows a thank you message', () => {
      expect(wrapper.text()).toContain('Thank you for your feedback.');
    });
  });

  describe('methods', () => {
    describe('#getPageUrl', () => {
      let originalWindowLocation;
      beforeEach(() => {
        originalWindowLocation = window.location;
        delete window.location;
        window.location = {};
      });

      afterEach(() => {
        // Restore the original window.location object
        window.location = originalWindowLocation;
      });

      const testCases = [
        [
          '?url=https%3A%2F%2Fexample.com',
          'https://example.com',
        ],
        [
          '?url=https%3A%2F%2Fwww.judicialappointments.gov.uk%2Fgood-character',
          'https://www.judicialappointments.gov.uk/good-character',
        ],
        [
          '?url=https%3A%2F%2Fexample.com%2F%3Fpid%3D278%26hl%3Den&another_param=true',
          'https://example.com/?pid=278&hl=en',
        ]
      ];
      describe.each(testCases)('when the query string is "%s"', (queryString, url) => {
        beforeEach(() => {
          window.location.search = queryString;
        });
        it(`returns "${url}"`, () => {
          expect(wrapper.vm.getPageUrl()).toBe(url);
        });
      });

      describe('when the query string is empty', () => {
        it('returns `null`', () => {
          expect(wrapper.vm.getPageUrl()).toBeNull();
        });
      });

      describe("when the query string doesn't contain a `url` parameter", () => {
        beforeEach(() => {
          window.location.search = '?another=value';
        });

        it('returns `null`', () => {
          expect(wrapper.vm.getPageUrl()).toBeNull();
        });
      });
    });

    describe('#saveToFirestore', () => {
      afterEach(async () => {
        await deleteCollection('feedback');
      });

      it('returns a Promise', () => {
        const save = wrapper.vm.saveToFirestore({});
        expect(save).toBeInstanceOf(Promise);
      });

      describe('the Promise', () => {
        it('creates a new document in the Firestore collection `/feedback`', async () => {
          const before = await firestore.collection('feedback').get();
          expect(before.size).toBe(0);

          await wrapper.vm.saveToFirestore({});

          const after = await firestore.collection('feedback').get();
          expect(after.size).toBe(1);
        });

        const mockFeedback = [
          [
            'positive feedback',
            {
              useful: true,
              url: 'https://example.com/good-feedback',
            },
          ],
          [
            'negative feedback',
            {
              useful: false,
              reason: null,
              comments: '',
              url: 'https://example.com/bad-feedback',
            },
          ],
          [
            'negative feedback with reason',
            {
              useful: false,
              reason: 'I don’t understand',
              comments: '',
              url: 'https://example.com/bad-feedback-with-reason',
            },
          ],
          [
            'negative feedback with reason & comments',
            {
              useful: false,
              reason: 'I don’t understand',
              comments: 'This page is terrible. Please change it.',
              url: 'https://example.com/bad-feedback-with-comments',
            },
          ]
        ];

        describe('sets the document data to the supplied `feedback` object', () => {
          it.each(mockFeedback)('mock payload: %s', async (name, feedback) => {
            await wrapper.vm.saveToFirestore(feedback);
            const records = await firestore.collection('feedback').get();
            const record = records.docs[0];
            expect(record.data()).toEqual(feedback);
          });
        });
      });
    });

    describe('#saveFeedback', () => {
      beforeEach(() => {
        wrapper.vm.saveToFirestore = jest.fn().mockResolvedValue(undefined);
      });

      it('returns a Promise', () => {
        const save = wrapper.vm.saveFeedback({});
        expect(save).toBeInstanceOf(Promise);
      });

      describe('the Promise', () => {
        it('saves the feedback object to Firestore, with added key `url` with value from `getPageUrl`', async () => {
          const feedback = {
            useful: false,
            reason: 'I don’t understand',
            comments: 'This page is terrible. Please change it.',
          };

          wrapper.vm.getPageUrl = jest.fn().mockReturnValue('https://example.com/page');

          await wrapper.vm.saveFeedback({...feedback});

          expect(wrapper.vm.getPageUrl).toHaveBeenCalled();
          expect(wrapper.vm.saveToFirestore).toHaveBeenCalledTimes(1);
          expect(wrapper.vm.saveToFirestore).toHaveBeenCalledWith({
            ...feedback,
            url: 'https://example.com/page',
          });
        });

        it('sets `submitted` to true', async () => {
          expect(wrapper.vm.submitted).toBe(false);
          await wrapper.vm.saveFeedback({});
          expect(wrapper.vm.submitted).toBe(true);
        });
      });
    });
  });
});
