<template>
  <div id="app">


    <div class="govuk-width-container">
      <main class="govuk-main-wrapper">

        <hr class="govuk-section-break govuk-section-break--xl govuk-section-break--visible">

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              <h1 class="govuk-fieldset__heading">
                Is this page useful?
              </h1>
            </legend>
            <div class="govuk-radios govuk-radios--inline govuk-radios--small">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="changed-name-1" name="changed-name" type="radio" value="yes">
                <label class="govuk-label govuk-radios__label" for="changed-name-1">
                  Yes
                </label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="changed-name-2" name="changed-name" type="radio" value="no">
                <label class="govuk-label govuk-radios__label" for="changed-name-2">
                  No
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              <h1 class="govuk-fieldset__heading">
                Why isn’t this page useful?
              </h1>
            </legend>
            <div class="govuk-radios govuk-radios--small">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="changed-name-12" name="changed-name2" type="radio" value="yes">
                <label class="govuk-label govuk-radios__label" for="changed-name-12">
                  It isn’t relevant to my situation
                </label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="changed-name-23" name="changed-name2" type="radio" value="no">
                <label class="govuk-label govuk-radios__label" for="changed-name-23">
                  It doesn’t have enough detail
                </label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="changed-name-24" name="changed-name2" type="radio" value="no">
                <label class="govuk-label govuk-radios__label" for="changed-name-24">
                  I can’t work out what I should do next
                </label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="changed-name-25" name="changed-name2" type="radio" value="no">
                <label class="govuk-label govuk-radios__label" for="changed-name-25">
                  I don’t understand
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="govuk-form-group">
          <label class="govuk-fieldset__legend govuk-fieldset__legend--m" for="more-detail">
            Is there anything else you’d like to tell us?
          </label>
          <textarea class="govuk-textarea" id="more-detail" name="more-detail" rows="5" aria-describedby="more-detail-hint"></textarea>
        </div>

        <button type="submit" class="govuk-button">
          Submit feedback
        </button>

      </main>
    </div>


  </div>
</template>

<script>

export default {
  components: {
  }
}
</script>

<style lang="scss">
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
