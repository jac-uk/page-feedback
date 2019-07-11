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

    it("doesn't pre-select any of the radio inputs", () => {
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

    describe('`submit` event payload', () => {
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

    it("doesn't ask any additional questions", () => {
      expect(wrapper.findAll('.govuk-fieldset__legend').length).toBe(1);
      expect(wrapper.findAll('input')).toHaveLength(2);
    });
  });

  describe('when I respond "No"', () => {
    beforeEach(() => {
      const label = findLabel('No');
      findLabelTarget(label).trigger('click');
    });

    it('shows a form submit button with text "Submit feedback"', () => {
      const button = wrapper.find('button');
      expect(button.exists()).toBe(true);
      expect(button.text()).toEqual('Submit feedback');
      expect(button.attributes('type')).toBe('submit');
    });

    it("doesn't emit an event", () => {
      expect(wrapper.emitted()).toEqual({});
    });

    it('asks additional questions', () => {
      expect(wrapper.findAll('.govuk-fieldset__legend').length).toBeGreaterThan(1);
    });

    describe('additional questions', () => {
      describe('"Why isn’t this page useful?"', () => {
        it('asks "Why isn’t this page useful?"', () => {
          expect(wrapper.text()).toContain('Why isn’t this page useful?');
        });

        describe('shows response options', () => {
          const responses = [
            'It isn’t relevant to my situation',
            'It doesn’t have enough detail',
            'I can’t work out what I should do next',
            'I don’t understand',
          ];
          it.each(responses)('radio input with label "%s"', (text) => {
            const label = findLabel(text);
            expect(label).not.toBeNull();
            expect(label.exists()).toBe(true);
            const radio = findLabelTarget(label);
            expect(radio.exists()).toBe(true);
            expect(radio.is('input')).toBe(true);
            expect(radio.attributes('type')).toBe('radio');
          });
        });

        it("doesn't pre-select any of the radio inputs", () => {
          const radios = wrapper.find({ref: 'reasonQuestion'}).findAll('input[type=radio]:checked');
          expect(radios.length).toBe(0);
        });
      });

      describe('"Is there anything else you’d like to tell us?"', () => {
        it('asks "Is there anything else you’d like to tell us?"', () => {
          expect(wrapper.text()).toContain('Is there anything else you’d like to tell us?');
        });

        it('is a label element', () => {
          const label = findLabel('Is there anything else you’d like to tell us?');
          expect(label.exists()).toBe(true);
        });

        it('is associated with a textarea input', () => {
          const label = findLabel('Is there anything else you’d like to tell us?');
          const input = findLabelTarget(label);
          expect(input.is('textarea')).toBe(true);
        });
      });
    });

    describe('when the form is submitted', () => {
      beforeEach(() => {
        wrapper.find('form').trigger('submit');
      });

      it('emits a `submit` event', () => {
        expect(wrapper.emitted('submit')).toBeTruthy();
      });

      describe('`submit` event payload', () => {
        let payload;
        beforeEach(() => {
          payload = wrapper.emitted('submit')[0][0];
        });

        it('is an object', () => {
          expect(typeof payload).toBe('object');
          expect(payload).not.toBeNull();
        });

        it('contains a `useful` key with value `false`', () => {
          expect(payload).toEqual(
            expect.objectContaining({
              useful: false
            })
          );
        });

        it('contains a `comments` key', () => {
          expect(payload).toHaveProperty('comments');
        });

        it('contains a `reason` key', () => {
          expect(payload).toHaveProperty('reason');
        });
      });
    });
  });
});
