define(["qlik", "text!./template.html", "text!./styles.css"], function (
  qlik,
  template,
  styles
) {
  "use strict";

  [styles].forEach((cssModule) => {
    $("<style>").html(cssModule).appendTo("head");
  });

  return {
    template: template,
    support: {
      snapshot: false,
      export: false,
      exportData: false,
    },
    paint: function () {
      return qlik.Promise.resolve();
    },
    controller: [
      "$scope",
      function ($scope) {
        $scope.j4Link =
          "https://qlik.advana.data.mil/sense/app/0695026d-95cb-40bc-8db3-f19e944f9994/sheet/91d194c4-60a3-4186-a6ac-5c4a7042ac71/state/edit";
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
        });
      },
    ],
  };
});
