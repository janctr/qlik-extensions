define([
  "qlik",
  "jquery",
  "./properties",
  "./util",
  "text!./style.css",
  "text!./parallax.css",
  "text!./index.html",
], function (qlik, $, properties, Util, cssContent, parallaxCss, template) {
  "use strict";

  const {
    appId,
    sheets,
    isWebLink,
    isSheetLink,
    isNotLink,
    getSheetUrl,
    getHref,
    getBackgroundImageUrl,
    makeClassFromTitle,
    navigateToSheet,
    navigateToUrl,
    navigateToUrlInNewTab,
  } = Util;

  [cssContent, parallaxCss].forEach((cssModule) => {
    $("<style>").html(cssModule).appendTo("head");
  });

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
    definition: properties,
    support: {
      snapshot: true,
      export: true,
      exportData: true,
    },
    paint: function ($element, layout) {
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
          layout.pageSettings.pageTitleBackgroundColor.color;
        $scope.pageTitleTextColor =
          layout.pageSettings.pageTitleTextColor.color;
        /*********************/
        $scope.menuItems = layout.menuItems;
        $scope.getSheetUrl = getSheetUrl;
        $scope.getHref = getHref;
        $scope.pacomLogoUrl = `/appcontent/${appId}/usindopacom-logo.png`;
        $scope.makeClassFromTitle = makeClassFromTitle;

        $(document).ready(() => {
          $(".j43-card-wrapper").css(
            "background-color",
            layout.pageSettings.pageBackgroundColor.color
          );

          for (const menuItem of layout.menuItems) {
            $("<style>").html(menuItem.customCss).appendTo("head");

            const cardClass =
              menuItem.cardClass || makeClassFromTitle(menuItem);

            if (cardClass) {
              /* Apply custom background image */
              if (menuItem.coverImageUrl) {
                $(`.${menuItem.cardClass} > .front`).css(
                  "background-image",
                  getBackgroundImageUrl({ menuItem })
                );
              }

              if (menuItem.isFlippable) {
                /* Toggle hover class for cards on hover */
                $(`.container.${cardClass}`).hover(function () {
                  $(this).toggleClass("hover");
                });
                /* Make it so when you click on a card it stays flipped */
                $(`.container.${cardClass}`).click(function () {
                  $(this).toggleClass("keep-hovered");
                });
              }

              if (
                menuItem.clickToFollowLink &&
                !isNotLink(menuItem) &&
                (menuItem.href || menuItem.sheetId)
              ) {
                /* Determine the onClick callback */
                let handler;
                if (menuItem.sheetId && isSheetLink(menuItem)) {
                  handler = function () {
                    navigateToSheet(menuItem.sheetId);
                  };
                } else {
                  handler = function () {
                    navigateToUrlInNewTab(
                      getHref({
                        menuItem,
                        isSipr: $scope.isSipr,
                      })
                    );
                  };
                }

                /* Assign onClick event handler */
                $(`.${cardClass}`).parent().click(handler);
              } else if (
                !isNotLink(menuItem) &&
                (menuItem.href || menuItem.sheetId)
              ) {
                if (menuItem.sheetId && isSheetLink(menuItem)) {
                  $(`.${menuItem.cardClass} > .back > a`).click(function () {
                    navigateToSheet(menuItem.sheetId);
                  });
                } else {
                  $(`.${menuItem.cardClass} > .back > a`).attr(
                    "href",
                    getHref({
                      menuItem,
                      isSipr: $scope.isSipr,
                    })
                  );
                }
              } else {
                // No link for this card
              }

              /* Make font smaller if too much text */
              if (menuItem.isComingSoon) {
                if (menuItem.ribbonLabel && menuItem.ribbonLabel.length >= 14) {
                  $(`.${menuItem.cardClass} .coming-soon-ribbon`).toggleClass(
                    "font-smaller"
                  );
                }
              }
            }

            /* Apply custom front/back styles */
            if (menuItem.cardFrontStyles) {
              const cardFrontEl = $(`.${menuItem.cardClass} > .front`);
              cardFrontEl.attr(
                "style",
                cardFrontEl.attr("style") + ";" + menuItem.cardFrontStyles
              );
            }

            if (menuItem.cardBackStyles) {
              const cardBackEl = $(`.${menuItem.cardClass} > .back`);
              cardBackEl.attr(
                "style",
                cardBackEl.attr("style") + ";" + menuItem.cardBackStyles
              );
            }
          }

          /* Apply easter egg */
          $(".jloc > .back").append(
            $(
              `<div 
                class="easter-egg"
                style="
                height:100%;
                width:100%; 
                position: absolute;
                background-image: url('/appcontent/${appId}/kobe.jpg');"></div>`
            )
          );

          $(".jloc > .back").on("keyup", function (event) {
            if (event.keyCode === 56) {
              $(".easter-egg").css("top", 0);
              $(".easter-egg").css("opacity", 1);
            }
          });
          /********************/
        });

        if ($scope.pageTitleBackgroundColor) {
          $(".j43-page-title").css(
            "background-color",
            $scope.pageTitleBackgroundColor
          );
        }

        if ($scope.pageTitleTextColor) {
          $(".j43-page-title").css("color", $scope.pageTitleTextColor);
        }
      },
    ],
  };
});
