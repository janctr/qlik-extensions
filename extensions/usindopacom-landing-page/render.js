define(["jquery", "./util"], function ($, Util) {
  const {
    appId,
    isSheetLink,
    isNotLink,
    getHref,
    getBackgroundImageUrl,
    getObjectContentId,
    getObjectTitleId,
    makeClassFromTitle,
    navigateToSheet,
    navigateToUrlInNewTab,
  } = Util;

  return function render(layout) {
    function qualifySelector(selector) {
      // Use this when making jQuery selections
      // so other qlik objects are not targeted
      const contentId = `#${getObjectContentId(layout)}`; // Prepend to every query

      return `${contentId} ${selector}`;
    }

    const pageTitle = layout.pageSettings.pageTitle;
    const isSipr = layout.pageSettings.isSipr;
    const pageTitleBackgroundColor =
      layout.pageSettings.pageTitleBackgroundColor.color;
    const pageTitleTextColor = layout.pageSettings.pageTitleTextColor.color;
    const pageBackgroundColor = layout.pageSettings.pageBackgroundColor.color;
    const logoUrl = layout.pageSettings.logoMedia;
    const logoLink = layout.pageSettings.logoLink;
    const customCardDimensions = layout.pageSettings.customCardDimensions;

    $(`header#${getObjectTitleId(layout)}`).css("display", "none"); // Remove title (The default qlik one that leaves ugly white space at the top)

    $(qualifySelector(".pacom-page-title")).text(pageTitle); // Set page title if it has changed
    $(qualifySelector(".pacom-wrapper")).css(
      "background-color",
      pageBackgroundColor
    );

    // Set top left logo image
    const logoPath = !!logoUrl
      ? logoUrl
      : `/appcontent/${appId}/usindopacom-logo.png`;

    $(qualifySelector(".pacom-logo")).attr("src", logoPath);

    // Set logo link if not empty or null
    $(qualifySelector(".pacom-logo")).off(); // Clear event handlers
    if (logoLink) {
      $(qualifySelector(".pacom-logo")).click(function () {
        navigateToUrlInNewTab(logoLink);
      });
    }

    if (pageTitleBackgroundColor) {
      $(qualifySelector(".pacom-page-title")).css(
        "background-color",
        pageTitleBackgroundColor
      );
    }

    if (pageTitleTextColor) {
      $(qualifySelector(".pacom-page-title")).css("color", pageTitleTextColor);
    }

    // Change dimensions of each card
    if (customCardDimensions) {
      const { cardHeight, cardWidth } = layout.pageSettings;

      if (!Number.isNaN(cardHeight)) {
        $(qualifySelector(".front")).css("min-height", `${cardHeight}px`);
        $(qualifySelector(".back")).css("min-height", `${cardHeight}px`);
      }

      if (!Number.isNaN(cardWidth)) {
        $(qualifySelector(".front")).css("width", `${cardWidth}px`);
        $(qualifySelector(".back")).css("width", `${cardWidth}px`);
      }
    }

    for (const menuItem of layout.menuItems) {
      $("<style>").html(menuItem.customCss).appendTo("head");

      const cardClass = menuItem.cardClass || makeClassFromTitle(menuItem);

      if (cardClass) {
        /* Apply custom background image */
        if (menuItem.coverImageUrl) {
          $(qualifySelector(`.${cardClass} > .front`)).css(
            "background-image",
            getBackgroundImageUrl({ menuItem })
          );
        }

        if (menuItem.coverImageMedia) {
          $(qualifySelector(`.${cardClass} > .front`)).css(
            "background-image",
            `url(${menuItem.coverImageMedia})`
          );
        }

        if (menuItem.isFlippable) {
          $(qualifySelector(`.container.${cardClass}`)).off(); // Unassign any event handlers
          /* Toggle hover class for cards on hover */
          $(qualifySelector(`.container.${cardClass}`)).hover(function () {
            $(this).toggleClass("hover");
          });
          /* Make it so when you click on a card it stays flipped */
          $(qualifySelector(`.container.${cardClass}`)).click(function () {
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
                  isSipr,
                })
              );
            };
          }

          /* Assign onClick event handler */
          $(qualifySelector(`.${cardClass}`))
            .parent()
            .off();
          $(qualifySelector(`.${cardClass}`))
            .parent()
            .click(handler);
        } else if (
          !isNotLink(menuItem) &&
          (menuItem.href || menuItem.sheetId)
        ) {
          if (menuItem.sheetId && isSheetLink(menuItem)) {
            $(qualifySelector(`.${cardClass} > .back > a`)).click(function () {
              navigateToSheet(menuItem.sheetId);
            });
          } else {
            $(qualifySelector(`.${cardClass} > .back > a`)).attr(
              "href",
              getHref({
                menuItem,
                isSipr,
              })
            );
          }
        } else {
          // No link for this card
        }

        /* Make font smaller if too much text */
        if (menuItem.isComingSoon) {
          if (menuItem.ribbonLabel && menuItem.ribbonLabel.length >= 14) {
            if (
              !$(qualifySelector(`.${cardClass} .coming-soon-ribbon`)).hasClass(
                "font-smaller"
              )
            ) {
              /* Too many nested ifs, but necessary because double renders may toggle this on then off again.*/
              $(
                qualifySelector(`.${cardClass} .coming-soon-ribbon`)
              ).toggleClass("font-smaller");
            }
          }
        }
      }

      /* Apply custom front/back styles */
      if (menuItem.cardFrontStyles) {
        const cardFrontEl = $(qualifySelector(`.${cardClass} > .front`));
        cardFrontEl.attr(
          "style",
          cardFrontEl.attr("style") + ";" + menuItem.cardFrontStyles
        );
      }

      if (menuItem.cardBackStyles) {
        const cardBackEl = $(qualifySelector(`.${cardClass} > .back`));
        cardBackEl.attr(
          "style",
          cardBackEl.attr("style") + ";" + menuItem.cardBackStyles
        );
      }
    }

    /* Apply easter egg */
    if (!$(qualifySelector(".easter-egg")).length) {
      $(qualifySelector(".jloc > .back")).append(
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

      $(qualifySelector(".jloc > .back")).on("keyup", function (event) {
        if (event.keyCode === 56) {
          $(".easter-egg").css("top", 0);
          $(".easter-egg").css("opacity", 1);
        }
      });
    }
    /********************/
  };
});
