define([
  "qlik",
  "jquery",
  "text!./style.css",
  "text!./template.html",
], function (qlik, $, cssContent, template) {
  "use strict";
  $("<style>").html(cssContent).appendTo("head");

  const sheets = qlik.navigation.sheets.map(
    ({ qInfo: { qId }, qMeta: { title } }) => ({ label: title, value: qId })
  );

  function isWebLink(x) {
    return x.linkType === "web-link";
  }

  function isSheetLink(x) {
    return x.linkType === "sheet-link";
  }

  function getSheetUrl({ isSipr, sheetId }) {
    const appId = qlik.currApp().id;

    return `https://qlik.advana.data${
      isSipr && ".smil"
    }.mil/sense/app/${appId}/sheet/${sheetId}`;
  }

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
    definition: {
      type: "items",
      component: "accordion",
      items: {
        pageSettings: {
          type: "items",
          label: "Page Settings",
          translation: "Page Settings",
          ref: "pageSettings",
          items: {
            pageTitle: {
              type: "string",
              ref: "pageSettings.pageTitle",
              label: "Page title",
              defaultValue: "My great title",
            },
          },
        },
        menuItems: {
          type: "array",
          translation: "Links",
          ref: "menuItems",
          min: 1,
          allowAdd: true,
          allowRemove: true,
          allowMove: true,
          addTranslation: "Add Link",
          grouped: true,
          itemTitleRef: "label",
          items: {
            label: {
              type: "string",
              ref: "label",
              label: "Label",
            },
            menuItemType: {
              type: "string",
              component: "dropdown",
              ref: "linkType",
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
              show: isWebLink,
            },
            sheet: {
              type: "string",
              component: "dropdown",
              ref: "sheetId",
              label: "Sheet",
              defaultValue: 0,
              options: sheets,
              show: isSheetLink,
            },
            iconUrl: {
              type: "string",
              ref: "iconUrl",
              label: "Icon URL",
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
    paint: function () {
      return qlik.Promise.resolve();
    },
    controller: [
      "$scope",
      function ($scope) {
        const layout = $scope.layout;
        console.log("layout: ", layout);
        $scope.pageTitle = layout.pageSettings.pageTitle;
        $scope.menuItems = layout.menuItems;
        $scope.getSheetUrl = getSheetUrl;
        /* menuItems looks like:
            [
                {
                    label: 'Google',
                    linkType: 'sheet-link' | 'web-link',
                    href: 'google.com',
                    sheetId: NON-NULL if linkType === 'sheet-link'
                    iconUrl: 'imgur.com/sdf86
                },
                {
                    ...
                }
            ]
        */
      },
    ],
  };
});
