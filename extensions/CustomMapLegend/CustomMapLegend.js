define(["qlik", "jquery", "css!./style.css", "text!./template.html"], function (
  qlik,
  $,
  cssContent,
  template
) {
  "use strict";

  function render(layout) {
    // console.log("map canvas: ", $(".idevio-map-canvas"));

    if (!layout?.legendItems?.length) return true;

    if ($(".legend-items").length) {
      $(".legend-items").remove();
    }

    const legendItems = layout.legendItems.map((legendItem) =>
      $(`
            <div class="legend-item">
                <span class="legend-item-image"><img src="${legendItem.image}" /></span>
                <span class="legend-item-label">${legendItem.label}</span>
            </div>`)
    );

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

    // Check if container to render in exists
    if (!$(".idevio-map-canvas").length) {
      return false;
    }
    //

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

    const visibility =
      qlik.navigation.getMode() === "edit" ? "visible" : "hidden";
    mapLegendContainerObject.css("visibility", visibility);

    return true;
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
      // render(layout);
      return qlik.Promise.resolve();
    },
    controller: [
      "$scope",
      function ($scope) {
        const layout = $scope.layout;
        console.log("Map legend layout: ", layout);

        $scope.legendItems = layout.legendItems;

        const interval = setInterval(() => {
          const success = render(layout);

          if (success) {
            clearInterval(interval);
          }
        }, 2500);
      },
    ],
  };
});
