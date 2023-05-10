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

  const appId = qlik.currApp().id;

  const sheets = qlik.navigation.sheets.map(
    ({ qInfo: { qId }, qMeta: { title } }) => ({ label: title, value: qId })
  );

  function isWebLink(menuItem) {
    return menuItem.linkType === "web-link";
  }

  function isSheetLink(menuItem) {
    return menuItem.linkType === "sheet-link";
  }

  function isNotLink(menuItem) {
    return menuItem.linkType === "no-link";
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

  function getBackgroundImageUrl({ menuItem }) {
    const appId = qlik.currApp().id;
    const filename = menuItem.coverImageUrl;

    return `url(/appcontent/${appId}/${filename})`;
  }

  function makeClassFromTitle(menuItem) {
    if (!menuItem.cardTitle && !menuItem.cardSubtitle) return false;

    let className = menuItem.cardTitle || menuItem.cardSubtitle;

    return className
      .split(" ")
      .map((s) => s.trim())
      .join("-");
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
            pageBackgroundColor: {
              type: "string",
              ref: "pageSettings.pageBackgroundColor",
              label: "Background Color",
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
            isComingSoon: {
              type: "boolean",
              component: "radiobuttons",
              ref: "isComingSoon",
              label: "Coming soon banner:",
              defaultValue: false,
              options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
              ],
            },
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
                {
                  label: "None",
                  value: "no-link",
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
            cardClass: {
              type: "string",
              label: "HTML class (applied to markup)",
              ref: "cardClass",
            },
            coverImageUrl: {
              type: "string",
              ref: "coverImageUrl",
              label: "Cover Image URL (File name)",
            },
            isFlippable: {
              type: "boolean",
              ref: "isFlippable",
              label: "Can Card Flip",
              component: "radiobuttons",
              defaultValue: true,
              options: [
                {
                  label: "Yes",
                  value: true,
                },
                {
                  label: "No",
                  value: false,
                },
              ],
            },
            clickToFollowLink: {
              type: "boolean",
              ref: "clickToFollowLink",
              label: "Can click card to follow link.",
              component: "radiobuttons",
              defaultValue: true,
              options: [
                {
                  label: "Yes",
                  value: true,
                },
                {
                  label: "No",
                  value: false,
                },
              ],
            },
            cardBackTitle: {
              type: "string",
              ref: "cardBackTitle",
              label: "Title (back of card)",
            },
            cardDescription: {
              type: "string",
              component: "textarea",
              label: "Description (back of card)",
              rows: 10,
              ref: "cardDescription",
            },
            cardVisitButtonText: {
              type: "string",
              ref: "cardVisitButtonText",
              label: "Text for the link on back of card",
            },
            cardIsVisitButtonEnabled: {
              type: "boolean",
              component: "radiobuttons",
              label: "Enable 'VISIT' button",
              ref: "cardIsVisitButtonEnabled",
              defaultValue: true,
              options: [
                {
                  label: "Enabled",
                  value: true,
                },
                {
                  label: "Disabled",
                  value: false,
                },
              ],
            },
            cardFrontStyles: {
              type: "string",
              component: "textarea",
              label: "Custom CSS (Front of Card)",
              rows: 10,
              ref: "cardFrontStyles",
            },
            cardBackStyles: {
              type: "string",
              component: "textarea",
              label: "Custom CSS (Back of card)",
              rows: 10,
              ref: "cardBackStyles",
            },
            customCss: {
              type: "string",
              component: "textarea",
              label: "Custom CSS (Applied to page)",
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
          layout.pageSettings.pageTitleBackgroundColor;
        $scope.pageTitleTextColor = layout.pageSettings.pageTitleTextColor;
        /*********************/
        $scope.menuItems = layout.menuItems;
        $scope.getSheetUrl = getSheetUrl;
        $scope.getHref = getHref;
        $scope.pacomLogoUrl = `/appcontent/${appId}/usindopacom-logo.png`;
        $scope.makeClassFromTitle = makeClassFromTitle;

        $(document).ready(() => {
          $(".j43-card-wrapper").css(
            "background-color",
            layout.pageSettings.pageBackgroundColor
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
                $(`.${cardClass}`)
                  .parent()
                  .click(function () {
                    window.location = getHref({
                      menuItem,
                      isSipr: $scope.isSipr,
                    });
                  });
              } else if (
                !isNotLink(menuItem) &&
                (menuItem.href || menuItem.sheetId)
              ) {
                $(`.${menuItem.cardClass} > .back > a`).attr(
                  "href",
                  getHref({
                    menuItem,
                    isSipr: $scope.isSipr,
                  })
                );
              } else {
                // No link for this card
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
            console.log("yoyo: ", event);
            if (event.keyCode === 56) {
              $(".easter-egg").css("top", 0);
              $(".easter-egg").css("opacity", 1);
            }
          });
          /********************/
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
