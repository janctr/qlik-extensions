define([
  "qlik",
  "jquery",
  "./properties",
  "./util",
  "./render",
  "text!./style.css",
  "text!./parallax.css",
  "text!./index.html",
], function (
  qlik,
  $,
  properties,
  Util,
  Render,
  cssContent,
  parallaxCss,
  template
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

  [cssContent, parallaxCss].forEach((cssModule) => {
    $("<style>").html(cssModule).appendTo("head");
  });

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
