define([
  "qlik",
  "jquery",
  "text!./style.css",
  "text!./template.html",
  "./properties",
  "./properties.prototype",
], function (qlik, $, cssContent, template, props, proto) {
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

        const gridWidth = $("#grid-wrap").width();
        console.log("griWidth: ", gridWidth);
        $(`#${navigationContainerId}`)
          .prependTo("#grid-wrap")
          .css("top", qlikSenseHeader.height() + qlikSenseSubHeader.height())
          .css("width", $("#grid-wrap").width() + "px");
      },
    ],

    paint: function ($, layout) {
      const gridWidth = $("#grid-wrap").width();
      console.log("griWidth: ", gridWidth);
      $("#top-navigation").css("width", gridWidth + "px");
    },
  };
});
