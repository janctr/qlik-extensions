define([
  "qlik",
  "jquery",
  "text!./style.css",
  "text!./template.html",
], function (qlik, $, cssContent, template) {
  "use strict";

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
                  value: "Sheet Link",
                  label: "sheet-link",
                },
                {
                  value: "Website URL",
                  label: "web-link",
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

        console.log(layout);

        $scope.myTitle = "Watch Bill";
        $scope.menuItems = layout.menuItems;
      },
    ],
  };
});
