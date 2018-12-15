import CleanCSS from 'clean-css';

const rawFontsCss = `
  /* source-sans-pro-400normal - latin */
  @font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-display: swap;
    font-weight: 400;
    src:
      local('Source Sans Pro Regular '),
      local('Source Sans Pro-Regular'),
      url('/source-sans-pro-latin-400.woff2') format('woff2'), /* Super Modern Browsers */
      url('/source-sans-pro-latin-400.woff') format('woff'); /* Modern Browsers */
  }

  /* source-sans-pro-400italic - latin */
  @font-face {
    font-family: 'Source Sans Pro';
    font-style: italic;
    font-display: swap;
    font-weight: 400;
    src:
      local('Source Sans Pro Regular italic'),
      local('Source Sans Pro-Regularitalic'),
      url('/source-sans-pro-latin-400italic.woff2') format('woff2'), /* Super Modern Browsers */
      url('/source-sans-pro-latin-400italic.woff') format('woff'); /* Modern Browsers */
  }

  /* source-sans-pro-600normal - latin */
  @font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-display: swap;
    font-weight: 600;
    src:
      local('Source Sans Pro SemiBold '),
      local('Source Sans Pro-SemiBold'),
      url('/source-sans-pro-latin-600.woff2') format('woff2'), /* Super Modern Browsers */
      url('/source-sans-pro-latin-600.woff') format('woff'); /* Modern Browsers */
  }

  /* source-sans-pro-600italic - latin */
  @font-face {
    font-family: 'Source Sans Pro';
    font-style: italic;
    font-display: swap;
    font-weight: 600;
    src:
      local('Source Sans Pro SemiBold italic'),
      local('Source Sans Pro-SemiBolditalic'),
      url('/source-sans-pro-latin-600italic.woff2') format('woff2'), /* Super Modern Browsers */
      url('/source-sans-pro-latin-600italic.woff') format('woff'); /* Modern Browsers */
  }
`;

export default new CleanCSS().minify(rawFontsCss).styles;
