import {shallowMount} from '@vue/test-utils';
import App from '@/App';
import FeedbackForm from '@/components/FeedbackForm';

describe('App', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(App);
  });

  describe('in its initial state', () => {
    it('renders the `FeedbackForm` component', () => {
      expect(wrapper.find(FeedbackForm).exists()).toBe(true);
    });
  });

  describe('when the feedback form has been submitted', () => {
    beforeEach(() => {
      const submitPayload = {
        useful: false,
        reason: 'I don’t understand',
        comments: 'The content is too wordy. Please make it easier to understand.',
      };
      wrapper.find(FeedbackForm).vm.$emit('submit', submitPayload);
    });

    it('saves the feedback to Firestore', () => {
      // TODO
    });

    it('removes the `FeedbackForm` component from the page', () => {
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
});
