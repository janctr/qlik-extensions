define(["qlik", "jquery", "css!./style.css", "text!./template.html"], function (
  qlik,
  $,
  cssContent,
  template
) {
  "use strict";

  function render(layout) {
    console.log("map canvas: ", $(".idevio-map-canvas"));

    if (!layout.legendItems.length) return;
    if ($(".legend-items").length) {
      $(".legend-items").remove();
    }

    const legendItems = layout.legendItems.map((legendItem) => {
      return $(`
            <div class="legend-item">
                <span class="legend-item-image"><img src="${legendItem.image}" /></span>
                <span class="legend-item-label">${legendItem.label}</span>
            </div>`);
    });

    const readinessGradient = `
      <div class="legend-gradient-container">
        <h5>Readiness Scale</h5>
        <div class="legend-gradient"></div>
      </div>`;

    const wrapper = $(
      `<div class="legend-items ${layout.legendSettings.position}">
            <h4>${layout.legendSettings.title}</h4>
        </div>`
    ).append(legendItems);

    wrapper.append(readinessGradient);

    wrapper.insertAfter($(".idevio-map-canvas"));

    const mapLegendContainerObject = $("#map-legend")
      .parent()
      .parent()
      .parent()
      .parent()
      .parent()
      .parent()
      .parent()
      .parent();

    if (qlik.navigation.getMode() === "edit") {
      mapLegendContainerObject.css("visibility", "visible");
    } else {
      mapLegendContainerObject.css("visibility", "hidden");
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
        legendSettings: {
          type: "items",
          label: "Legend Settings",
          ref: "legendSettings",
          translation: "Settings",
          items: {
            title: {
              type: "string",
              label: "Title",
              ref: "legendSettings.title",
            },
            position: {
              type: "string",
              label: "Position",
              component: "dropdown",
              ref: "legendSettings.position",
              defaultValue: "top-right",
              options: [
                { label: "Top Right", value: "top-right" },
                { label: "Top Left", value: "top-left" },
                { label: "Bottom Right", value: "bottom-right" },
                { label: "Bottom Left", value: "bottom-left" },
              ],
            },
          },
        },
        mapItems: {
          type: "array",
          translation: "Legend Items",
          ref: "legendItems",
          min: 1,
          allowAdd: true,
          allowRemove: true,
          allowMove: true,
          addTranslation: "Add Legend Item",
          grouped: true,
          itemTitleRef: "label",
          items: {
            label: {
              type: "string",
              ref: "label",
              label: "Legend Item Label",
            },
            image: {
              type: "string",
              label: "Legend Item Image",
              component: "media",
              ref: "image",
              layoutRef: "image",
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
    paint: function ($element, layout) {
      render(layout);
      return qlik.Promise.resolve();
    },
    controller: [
      "$scope",
      function ($scope) {
        const layout = $scope.layout;
        console.log("Map legend layout: ", layout);

        $scope.legendItems = layout.legendItems;

        setTimeout(function () {
          render(layout);
        }, 2000);
      },
    ],
  };
});
