define([
  "qlik",
  "jquery",
  "text!./style.css",
  "text!./template.html",
  "./properties",
], function (qlik, $, cssContent, template, props) {
  "use strict";

  console.log("qlik: ", qlik);

  const sheets = qlik.navigation.sheets.map((sheet) => {
    const {
      qInfo: { qId },
      qMeta: { title },
    } = sheet;

    return { label: title, value: qId };
  });

  console.log("sheets: ", sheets);

  function getSheetUrl(sheetId) {
    const appId = qlik.currApp().id;

    return `https://qlik.advana.data.mil/sense/app/${appId}/sheet/${sheetId}`;
  }

  $("<style>").html(cssContent).appendTo("head");

  return {
    template: template,
    definition: props.definition,
    controller: [
      "$scope",
      function ($scope) {
        const layout = $scope.layout;
        const navigationContainerId = "top-navigation";

        console.log(layout);

        $scope.navigationContainerId = navigationContainerId;
        $scope.menuItems = layout.menuItems;
        $scope.getSheetUrl = getSheetUrl;

        const qlikSenseHeader = $(".qs-header");
        const qlikSenseSubHeader = $(
          "#qv-page-container > div.MuiGrid-root.MuiGrid-container.MuiGrid-wrap-xs-nowrap.css-10f4c7e"
        );

        $(`#${navigationContainerId}`)
          .prependTo("#grid-wrap")
          .css("top", qlikSenseHeader.height() + qlikSenseSubHeader.height());
      },
    ],

    paint: function ($, layout) {},
  };
});
