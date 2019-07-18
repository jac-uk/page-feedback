module.exports = {
  chainWebpack: config => {
    /**
     * Disable prefetch for webpack dynamic imports
     *
     * The Firestore SDK is the only dynamic import in this application.
     * We expect that most users won't provide feedback on every page load. Therefore the
     * Firestore SDK won't be needed in the majority of cases. So to preserve end user
     * device resources and network usage, we only want to load Firestore when it's
     * actually needed rather than prefetching it on every page load.
     */
    config.plugins.delete('prefetch');
  }
};
