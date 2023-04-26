define([
  "qlik",
  "jquery",
  "text!./style.css",
  "text!./parallax.css",
  "text!./template.html",
], function (qlik, $, cssContent, parallaxCss, template) {
  "use strict";

  [cssContent, parallaxCss].forEach((cssModule) => {
    $("<style>").html(cssModule).appendTo("head");
  });

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
      isSipr ? ".smil" : ""
    }.mil/sense/app/${appId}/sheet/${sheetId}`;
  }

  function getHref({ menuItem, isSipr }) {
    switch (menuItem.linkType) {
      case "web-link":
        return menuItem.href;
      case "sheet-link":
        return getSheetUrl({ isSipr, sheetId: menuItem.sheetId });
      default:
        return "invalid link";
    }
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
              defaultValue: "Title",
            },
            pageTitleBackgroundColor: {
              type: "string",
              ref: "pageSettings.pageTitleBackgroundColor",
              label: "Title Background Color",
            },
            pageTitleTextColor: {
              type: "string",
              ref: "pageSettings.pageTitleTextColor",
              label: "Title Text Color",
            },
            isSipr: {
              type: "boolean",
              component: "radiobuttons",
              label: "NIPR/SIPR",
              defaultValue: false,
              ref: "pageSettings.isSipr",
              options: [
                { value: false, label: "NIPR" },
                { value: true, label: "SIPR" },
              ],
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
          itemTitleRef: "cardTitle",
          items: {
            cardTitle: {
              type: "string",
              ref: "cardTitle",
              label: "Card Title",
            },
            cardSubtitle: {
              type: "string",
              ref: "cardSubtitle",
              label: "Card Subtitle",
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
            sheetId: {
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
            cardDescription: {
              type: "string",
              component: "textarea",
              label: "Description (back of card)",
              rows: 10,
              ref: "cardDescription",
            },
            cardClass: {
              type: "string",
              label: "Class name (applied to markup)",
              ref: "cardClass",
            },
            customCss: {
              type: "string",
              component: "textarea",
              label: "Custom styling (CSS)",
              rows: 10,
              ref: "customCss",
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
        /* Extension settings */
        $scope.pageTitle = layout.pageSettings.pageTitle;
        $scope.isSipr = layout.pageSettings.isSipr;
        $scope.pageTitleBackgroundColor =
          layout.pageSettings.pageTitleBackgroundColor;
        $scope.pageTitleTextColor = layout.pageSettings.pageTitleTextColor;
        /*********************/
        $scope.menuItems = layout.menuItems;
        $scope.getSheetUrl = getSheetUrl;
        $scope.getHref = getHref;

        layout.menuItems.forEach((menuItem) => {
          $("<style>").html(menuItem.customCss).appendTo("head");
        });

        if ($scope.pageTitleBackgroundColor) {
          console.log("Changing title bg color");
          $(".j43-page-title").css(
            "background-color",
            $scope.pageTitleBackgroundColor
          );
        }

        if ($scope.pageTitleTextColor) {
          $(".j43-page-title").css("color", $scope.pageTitleTextColor);
        }

        /* menuItems looks like:
            [
                {
                    cardTitle: 'Google',
                    linkType: 'sheet-link' | 'web-link',
                    href: 'google.com',
                    sheetId: NON-NULL if linkType === 'sheet-link'
                    iconUrl: 'imgur.com/sdf86,
                    cardDescription: 'abcedf',
                    cardClass: 'fuels',
                    customCss: 'h1 { margin: 0; }

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
