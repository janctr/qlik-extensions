define([
  "qlik",
  "jquery",
  "text!./style.css",
  "text!./template.html",
], function (qlik, $, cssContent, template) {
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
    initialProperties: {
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
        qInitialDataFetch: [
          {
            qWidth: 20,
            qHeight: 200,
          },
        ],
      },
    },
    definition: {
      type: "items",
      component: "accordion",
      items: {
        menuItems: {
          type: "array",
          translation: "Menu Items",
          ref: "menuItems",
          min: 1,
          allowAdd: true,
          allowRemove: true,
          allowMove: true,
          addTranslation: "Add Items",
          grouped: true,
          items: {
            // TODO: figure out a way to label this the value passed into label or a default value like "Menu Item"
            label: {
              type: "string",
              ref: "label",
              label: "Label",
            },
            menuItemType: {
              type: "string",
              component: "dropdown",
              ref: "itemType",
              label: "Link Type",
              options: [
                {
                  label: "Sheet Link",
                  value: "sheet-link",
                },
                {
                  label: "Website URL",
                  value: "web-link",
                },
              ],
            },
            href: {
              type: "string",
              ref: "href",
              label: "URL",
              show: function (x) {
                return x.itemType === "web-link";
              },
            },
            sheet: {
              type: "string",
              component: "dropdown",
              ref: "sheetId",
              label: "Sheet",
              defaultValue: 0,
              options: sheets,
              show: function (x) {
                return x.itemType === "sheet-link";
              },
            },
          },
        },
      },
    },
    support: {
      snapshot: true,
      export: true,
      exportData: true,
    },

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
