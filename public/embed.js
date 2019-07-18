(function() {
  /**
   * URL for the Page Feedback web application
   * @type {string}
   */
  const APP_URL = 'https://jac-page-feedback.web.app';

  const iframeSrc = function() {
    const currentUrl = window.location.href;
    return APP_URL + '/?url=' + encodeURIComponent(currentUrl);
  };

  const createIframe = function() {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', iframeSrc());
    iframe.style.width = '100%';
    iframe.style.height = '0';
    iframe.style.border = '0';
    return iframe;
  };

  const embed = function(iframe) {
    const target = document.querySelector('#block-system-main .jac-web-related-column');
    if (!target) return;
    target.appendChild(iframe);
  };

  const setIframeHeight = function(event) {
    const data = event.data;
    if (event.origin === APP_URL && data && typeof data == 'object' && typeof data.setIframeHeight == 'number') {
      const height = data.setIframeHeight;
      iframe.style.height = height + 'px';
    }
  };

  const iframe = createIframe();
  embed(iframe);
  window.addEventListener('message', setIframeHeight);
})();
