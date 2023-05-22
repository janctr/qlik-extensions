define(["jquery", "./util"], function ($, Util) {
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

  function render(layout) {
    const isSipr = layout.pageSettings.isSipr;
    const pageTitleBackgroundColor =
      layout.pageSettings.pageTitleBackgroundColor.color;
    const pageTitleTextColor = layout.pageSettings.pageTitleTextColor.color;

    $(".pacom-wrapper").css(
      "background-color",
      layout.pageSettings.pageBackgroundColor.color
    );

    for (const menuItem of layout.menuItems) {
      $("<style>").html(menuItem.customCss).appendTo("head");

      const cardClass = menuItem.cardClass || makeClassFromTitle(menuItem);

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
                  isSipr,
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

    if (pageTitleBackgroundColor) {
      $(".pacom-page-title").css("background-color", pageTitleBackgroundColor);
    }

    if (pageTitleTextColor) {
      $(".pacom-page-title").css("color", pageTitleTextColor);
    }
  }

  return {
    render,
  };
});
