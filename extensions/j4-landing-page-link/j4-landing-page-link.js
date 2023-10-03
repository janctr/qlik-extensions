define([
  "qlik",
  "jquery",
  "text!./template.html",
  "text!./styles.css",
], function (qlik, $, template, styles) {
  "use strict";

  [styles].forEach((cssModule) => {
    $("<style>").html(cssModule).appendTo("head");
  });

  const properties = {
    type: "items",
    component: "accordion",
    items: {
      link: {
        type: "string",
        label: "Link",
        translation: "Link",
        ref: "link",
      },
      label: {
        type: "string",
        label: "Label",
        translation: "Label",
        ref: "label",
      },
    },
  };

  function render(layout) {
    const { link, label } = layout;
    $(".j4-landing-page-link-container > a ").attr("href", link);
    $(".j4-landing-page-link-container > a ").text(label);
  }

  return {
    template: template,
    support: {
      snapshot: false,
      export: false,
      exportData: false,
    },
    definition: properties,
    paint: function ($element, layout) {
      console.log("$element: ", $element);
      render(layout);
      return qlik.Promise.resolve();
    },
    controller: [
      "$scope",
      function ($scope) {
        const layout = $scope.layout;

        $scope.isToggled = false;

        $(document).ready(function () {
          $(".j4-landing-page-link-container").hover(function (event) {
            event.preventDefault();
            event.stopPropagation();
          });
          $(".j4-minimize").hover(function (event) {
            event.preventDefault();
            event.stopPropagation();
          });
          $(".j4-minimize").click(function () {
            $(this).toggleClass("toggled");
            $scope.isToggled = !$scope.isToggled;

            if ($scope.isToggled) {
              $(".j4-landing-page-link-container").css("bottom", "-20px");
            } else {
              $(".j4-landing-page-link-container").removeAttr("style");
            }
          });

          render(layout);
        });
      },
    ],
  };
});
