import {shallowMount} from '@vue/test-utils';
import FeedbackForm from '@/components/FeedbackForm';

describe('components/FeedbackForm', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(FeedbackForm);
  });

  const findLabel = (text) => {
    const labels = wrapper.findAll('label');
    const found = labels.filter(label => label.text() === text);
    return (found.length > 0) ? found.at(0) : null;
  };

  const findLabelTarget = (label) => {
    const inputId = label.attributes('for');
    return wrapper.find('#' + inputId);
  };

  describe('in its initial state', () => {
    it('asks "Is this page useful?"', () => {
      expect(wrapper.text()).toContain('Is this page useful?');
    });

    it('shows 2 form inputs', () => {
      expect(wrapper.findAll('input')).toHaveLength(2);
    });

    it.each(['Yes', 'No'])('shows a radio input with label "%s"', (text) => {
      const label = findLabel(text);
      expect(label).not.toBeNull();
      expect(label.exists()).toBe(true);
      const radio = findLabelTarget(label);
      expect(radio.exists()).toBe(true);
      expect(radio.is('input')).toBe(true);
      expect(radio.attributes('type')).toBe('radio');
    });

    it('no input radios are checked', () => {
      const radios = wrapper.findAll('input[type=radio]:checked');
      expect(radios.length).toBe(0);
    });
  });

  describe('when I respond "Yes"', () => {
    beforeEach(() => {
      const label = findLabel('Yes');
      findLabelTarget(label).trigger('click');
    });

    it('emits a `submit` event', () => {
      expect(wrapper.emitted('submit')).toBeTruthy();
    });

    describe('emitted `submit` event payload', () => {
      let payload;
      beforeEach(() => {
        payload = wrapper.emitted('submit')[0][0];
      });

      it('is an object', () => {
        expect(typeof payload).toBe('object');
        expect(payload).not.toBeNull();
      });

      it('only contains a `useful` key with value `true`', () => {
        expect(payload).toMatchObject({useful: true});
      });
    });

    it("doesn't ask any other questions", () => {
      expect(wrapper.findAll('.govuk-fieldset__legend').length).toBe(1);
      expect(wrapper.findAll('input')).toHaveLength(2);
    });
  });
});
