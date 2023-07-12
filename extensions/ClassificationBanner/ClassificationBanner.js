define(["qlik", "jquery", "text!./style.css", "text!./index.html"], function (
  qlik,
  $,
  cssContent,
  template
) {
  "use strict";
  $("<style>").html(cssContent).appendTo("head");

  const classifications = [
    {
      label: "Unclassified",
      value: { className: "unclassified", label: "UNCLASSIFIED" },
    },
    {
      label: "CUI",
      value: { className: "cui", label: "CUI" },
    },
    {
      label: "CONFIDENTIAL",
      value: { className: "confidential", label: "CONFIDENTIAL" },
    },
    {
      label: "SECRET",
      value: { className: "secret", label: "SECRET" },
    },
    {
      label: "TOP SECRET",
      value: { className: "top-secret", label: "TOP SECRET" },
    },
    {
      label: "TOP SECRET/SCI",
      value: { className: "ts-sci", label: "TOP SECRET/SCI" },
    },
  ];

  function getObjectId(layout) {
    return "classification-banner-" + layout.qInfo.qId;
  }

  function getObjectTitleId(layout) {
    return `${layout.qInfo.qId}_title`;
  }

  function render(layout) {
    // Get rid of title area
    $(`header#${getObjectTitleId(layout)}`).css("display", "none");

    // Get rid of padding
    $(`#${getObjectId(layout)}`)
      .find(".qv-inner-object")
      .css("padding", 0);

    $("#classification-banner-TPXxmG")
      .parent()
      .parent()
      .parent()
      .css("padding", 0);

    const extensionEl = $(`#${getObjectId(layout)}`);
    let mBackgroundColor = "";
    let mTextColor = "";

    const {
      presetOptions,
      backgroundColor,
      customBackgroundColor,
      customTextColor,
      isCustomStyling,
      title,
    } = layout.appearance;

    console.log("preset options: ", presetOptions);

    if (presetOptions) {
      classifications.forEach((classification) =>
        extensionEl.removeClass(classification.value.className)
      );

      extensionEl.addClass(presetOptions.className);
      extensionEl.find("header").text(presetOptions.label);
    }

    if (title) {
      extensionEl.find("header").text(title);
    }

    if (backgroundColor) {
      extensionEl.addClass(backgroundColor);
    }

    if (isCustomStyling && customBackgroundColor)
      mBackgroundColor = customBackgroundColor;
    if (isCustomStyling && customTextColor) mTextColor = customTextColor;

    if (mBackgroundColor) extensionEl.css("background-color", mBackgroundColor);
    if (mTextColor) extensionEl.css("color", mTextColor);
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
        appearance: {
          type: "items",
          label: "Appearance",
          items: {
            presetOptions: {
              ref: "appearance.presetOptions",
              component: "dropdown",
              label: "Presets:",
              type: "object",
              defaultValue: {
                className: "unclassified",
                label: "UNCLASSIFIED",
              },
              options: classifications,
            },
            title: {
              ref: "appearance.title",
              label: "Banner Title:",
              type: "string",
              defaultValue: "",
            },
            backgroundColor: {
              ref: "appearance.backgroundColor",
              component: "dropdown",
              label: "Background Color:",
              type: "string",
              defaultValue: "unclassified",
              options: [
                { label: "Unclassified", value: "unclassified" },
                { label: "CUI", value: "cui" },
                { label: "CONFIDENTIAL", value: "confidential" },
                { label: "SECRET", value: "secret" },
                { label: "TOP SECRET", value: "top-secret" },
                { label: "TOP SECRET/SCI", value: "ts-sci" },
              ],
            },
            customStyling: {
              ref: "appearance.isCustomStyling",
              label: "Enable custom colors",
              component: "switch",
              defaultValue: false,
              options: [
                { label: "Enabled", value: true },
                { label: "Disabled", value: false },
              ],
            },
            customBackgroundColor: {
              ref: "appearance.customBackgroundColor",
              label: "Custom Background Color:",
              component: "color-picker",
              type: "object",
              show: (c) => c.appearance.isCustomStyling,
            },
            customTextColor: {
              ref: "appearance.customTextColor",
              label: "Custom Text Color:",
              component: "color-picker",
              type: "object",
              show: (c) => c.appearance.isCustomStyling,
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
    paint: function ($element, layout) {
      render(layout);
      return qlik.Promise.resolve();
    },
    controller: [
      "$scope",
      function ($scope) {
        const layout = $scope.layout;
        console.log("scope: ", $scope);
        console.log("$scope.layout: ", $scope.layout);

        $scope.objectId = getObjectId($scope.layout);
        $scope.bannerTitle = $scope.layout.appearance.title;

        $(document).ready(() => {
          render(layout);
        });
      },
    ],
  };
});
