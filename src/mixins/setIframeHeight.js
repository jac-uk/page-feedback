import Vue from 'vue';

const html = document.querySelector('html');

let targetOrigin;
if (process.env.NODE_ENV === 'production') {
  // In production mode, only allow `postMessage` to the known production URL
  // This protects the app if it's embedded into other sites
  targetOrigin = 'https://www.judicialappointments.gov.uk';
} else {
  // In development and test mode, our target origin policy can be looser
  // Since we don't know where it'll be embedded from, allow all origins
  targetOrigin = '*';
}

const postMessage = () => {
  window.parent.postMessage({
    setIframeHeight: html.offsetHeight,
  }, targetOrigin);
};

const postMessageOnNextTick = () => {
  Vue.nextTick(postMessage);
};

const mixin = {
  mounted: postMessageOnNextTick,
  updated: postMessageOnNextTick,
};

export default mixin;
