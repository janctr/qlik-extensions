define([
  "qlik",
  "jquery",
  "./properties",
  "./util",
  "./render",
  "text!./index.html",
  "css!./style.css",
  "css!./parallax.css",
], function (
  qlik,
  $,
  properties,
  Util,
  Render,
  template,
  cssContent, // Stylesheets are automatically imported
  parallaxCss
) {
  "use strict";

  const { render } = Render;
  const {
    appId,
    sheets,
    isWebLink,
    isSheetLink,
    isNotLink,
    getSheetUrl,
    getHref,
    getBackgroundImageUrl,
    makeClassFromTitle,
    navigateToSheet,
    navigateToUrl,
    navigateToUrlInNewTab,
  } = Util;

  return {
    template: template,
    initialProperties: {
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
        qInitialDataFetch: [
          {
            qWidth: 0,
            qHeight: 0,
          },
        ],
      },
    },
    definition: properties,
    support: {
      snapshot: true,
      export: true,
      exportData: true,
    },
    paint: function ($element, layout) {
      render(layout);
      return qlik.Promise.resolve();
    },
    controller: [
      "$scope",
      function ($scope) {
        const layout = $scope.layout;
        console.log("layout: ", layout);
        /* Extension settings */
        $scope.pageTitle = layout.pageSettings.pageTitle;
        $scope.isSipr = layout.pageSettings.isSipr;
        $scope.pageTitleBackgroundColor =
          layout.pageSettings.pageTitleBackgroundColor.color;
        $scope.pageTitleTextColor =
          layout.pageSettings.pageTitleTextColor.color;
        /*********************/
        $scope.menuItems = layout.menuItems;
        $scope.getSheetUrl = getSheetUrl;
        $scope.getHref = getHref;
        $scope.pacomLogoUrl = `/appcontent/${appId}/usindopacom-logo.png`;
        $scope.makeClassFromTitle = makeClassFromTitle;

        $(document).ready(() => {
          render(layout);
        });
      },
    ],
  };
});
