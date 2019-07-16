<template>
  <form @submit.prevent="submit">
    <div class="govuk-form-group">
      <fieldset class="govuk-fieldset">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
          Is this page useful?
        </legend>
        <div class="govuk-radios govuk-radios--inline govuk-radios--small">
          <div class="govuk-radios__item">
            <input v-model="useful" :value="true" id="useful-yes" class="govuk-radios__input" type="radio">
            <label class="govuk-label govuk-radios__label" for="useful-yes">
              Yes
            </label>
          </div>
          <div class="govuk-radios__item">
            <input v-model="useful" :value="false" id="useful-no" class="govuk-radios__input" type="radio">
            <label class="govuk-label govuk-radios__label" for="useful-no">
              No
            </label>
          </div>
        </div>
      </fieldset>
    </div>

    <div v-if="useful === false">

      <div class="govuk-form-group" ref="reasonQuestion">
        <fieldset class="govuk-fieldset">
          <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
            Why isn’t this page useful?
          </legend>
          <div class="govuk-radios govuk-radios--small">
            <div v-for="(option, index) in reasonOptions" :key="option" class="govuk-radios__item">
              <input v-model="reason" :value="option" :id="`reason-${index}`" class="govuk-radios__input" type="radio">
              <label class="govuk-label govuk-radios__label" :for="`reason-${index}`">
                {{ option }}
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      <div class="govuk-form-group">
        <label class="govuk-fieldset__legend govuk-fieldset__legend--m" for="comments">
          Is there anything else you’d like to tell us?
        </label>
        <textarea v-model="comments" class="govuk-textarea" id="comments" rows="5"></textarea>
      </div>

      <button type="submit" class="govuk-button">
        Submit feedback
      </button>

    </div>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        useful: null,
        reasonOptions: [
          'It isn’t relevant to my situation',
          'It doesn’t have enough detail',
          'I can’t work out what I should do next',
          'I don’t understand',
        ],
        reason: null,
        comments: '',
      };
    },
    methods: {
      submit() {
        const feedback = {
          useful: this.useful,
        };

        if (this.useful === false) {
          feedback.reason = this.reason;
          feedback.comments = this.comments;
        }

        this.$emit('submit', feedback);
      }
    },
    watch: {
      useful(value) {
        if (value === true) {
          this.submit();
        }
      }
    },
  }
</script>
