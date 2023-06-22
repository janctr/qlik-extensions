define(["qlik", "jquery", "text!./style.css", "text!./index.html"], function (
  qlik,
  $,
  cssContent,
  template
) {
  "use strict";
  $("<style>").html(cssContent).appendTo("head");

  function getObjectId(layout) {
    return "classification-banner-" + layout.qInfo.qId;
  }

  function getObjectTitleId(layout) {
    return `${layout.qInfo.qId}_title`;
  }

  function render($scope, layout) {
    $(`header#${getObjectTitleId(layout)}`).css("display", "none");

    const objEl = $(`#${getObjectId(layout)}`)
      .find(".qv-inner-object")
      .css("padding", 0);

    console.log("objEl", objEl);
  }

  return {
    template: template,
    initialProperties: {
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
        qInitialDataFetch: [
          {
            qWidth: 10,
            qHeight: 50,
          },
        ],
      },
    },
    definition: {
      type: "items",
      component: "accordion",
      items: {
        settings: {
          uses: "settings",
          items: {
            backgroundColor: {
              ref: "settings.backgroundColor",
              label: "Background Color",
              type: "string",
              defaultValue: "red",
            },
          },
        },
      },
    },
    support: {
      snapshot: false,
      export: false,
      exportData: false,
    },
    paint: function () {
      return qlik.Promise.resolve();
    },
    controller: [
      "$scope",
      function ($scope) {
        console.log("scope: ", $scope);
        render($scope, $scope.layout);
        const objectId = "classification-banner-" + $scope.layout.qInfo.qId;

        $scope.objectId = objectId;
      },
    ],
  };
});
