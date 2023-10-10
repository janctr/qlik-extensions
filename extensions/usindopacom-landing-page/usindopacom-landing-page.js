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
  render,
  template,
  cssContent, // Stylesheets are automatically imported
  parallaxCss
) {
  "use strict";

  const { appId, getSheetUrl, getHref, makeClassFromTitle } = Util; // Import helpers

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

      console.log("layout: ", layout.qInfo.qId);

      if (!window.backendApi) {
        window.backendApi = {};
      }

      if (!window.backendApi[layout.qInfo.qId]) {
        /* Required to call setProperties() */
        window.backendApi[layout.qInfo.qId] = this.backendApi;
      }

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
        $scope.makeClassFromTitle = makeClassFromTitle;

        $(document).ready(() => {
          render(layout);
        });
      },
    ],
  };
});
