define([
  "qlik",
  "jquery",
  "text!./style.css",
  "text!./template.html",
], function (qlik, $, cssContent, template) {
  "use strict";

  console.log("qlik: ", qlik);

  $("<style>").html(cssContent).appendTo("head");

  const MenuItemsSection = {
    component: "items",
    label: "Menu Items",
    items: {
      menuItems: {
        type: "items",
        label: "Menu Items",
        items: {},
      },
    },
  };
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
        itemsList: {
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
            href: {
              type: "string",
              ref: "href",
              label: "URL",
            },
            menuItemType: {
              type: "string",
              component: "dropdown",
              ref: "itemType",
              translation: "Link Type",
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

            // itemType: {
            //   type: "string",
            //   component: "dropdown",
            //   ref: "menuItem",
            //   translation: "Item type",
            //   options: [
            //     {
            //       value: "A",

            //       label: "A-type",
            //     },
            //     {
            //       value: "B",

            //       label: "B-type",
            //     },
            //     {
            //       value: "C",

            //       label: "C-Type",
            //     },
            //   ],
            //   show: true,
            //   defaultValue: "A",
            // },
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

        const parentContainer = $("#grid-wrap");
        const qlikSenseHeader = $(".qs-header");
        const qlikSenseSubHeader = $(
          "#qv-page-container > div.MuiGrid-root.MuiGrid-container.MuiGrid-wrap-xs-nowrap.css-10f4c7e"
        );

        const totalHeaderHeightPx =
          qlikSenseHeader.height() + qlikSenseSubHeader.height();

        console.log("totalHeaderHeightPx: ", totalHeaderHeightPx);

        console.log("parentContainer: ", parentContainer);

        const nav = $(`#${navigationContainerId}`).prependTo("#grid-wrap");
        nav.css("top", totalHeaderHeightPx);
        console.log("nav: ", nav);
      },
    ],

    paint: function ($, layout) {
      console.log("paint called");
    },
  };
});
