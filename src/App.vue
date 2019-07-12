<template>
  <div class="govuk-width-container">
    <hr class="govuk-section-break govuk-section-break--xl govuk-section-break--visible">
    <FeedbackForm v-if="submitted === false" @submit="saveFeedback" />
    <div v-else>
      <div class="govuk-fieldset__legend govuk-fieldset__legend--m">
        Is this page useful?
      </div>
      <p>Thank you for your feedback.</p>
    </div>
  </div>
</template>

<script>
  import FeedbackForm from '@/components/FeedbackForm';

  export default {
    components: {
      FeedbackForm,
    },
    data() {
      return {
        submitted: false,
      };
    },
    methods: {
      saveFeedback(feedback) {
        this.submitted = true;
      }
    },
  }
</script>

<style lang="scss">
  $govuk-global-styles: true;
  $govuk-assets-path: "../node_modules/govuk-frontend/assets/";
  $govuk-font-family: "Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;
  @import "../node_modules/govuk-frontend/core/all";
  @import "../node_modules/govuk-frontend/objects/all";
  @import "../node_modules/govuk-frontend/components/button/button";
  @import "../node_modules/govuk-frontend/components/fieldset/fieldset";
  @import "../node_modules/govuk-frontend/components/input/input";
  @import "../node_modules/govuk-frontend/components/label/label";
  @import "../node_modules/govuk-frontend/components/radios/radios";
  @import "../node_modules/govuk-frontend/components/textarea/textarea";
</style>
