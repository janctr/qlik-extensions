define(["./About", "./util"], function (About, Util) {
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

  About(); // Initialize About panel

  const pageSettings = {
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
        ref: "pageSettings.pageTitleBackgroundColor",
        label: "Title Background Color",
        component: "color-picker",
        type: "object",
        defaultValue: {
          color: "#004A7C",
        },
      },
      pageTitleTextColor: {
        ref: "pageSettings.pageTitleTextColor",
        label: "Title Text Color",
        component: "color-picker",
        type: "object",
        defaultValue: {
          color: "#FFFFFF",
        },
      },
      pageBackgroundColor: {
        ref: "pageSettings.pageBackgroundColor",
        label: "Background Color",
        component: "color-picker",
        type: "object",
        defaultValue: {
          color: "#FFFFFF",
        },
      },
      customCardDimensions: {
        ref: "pageSettings.customCardDimensions",
        type: "boolean",
        component: "switch",
        label: "Enable custom dimension definition.",
        defaultValue: false,
        options: [
          { label: "Enabled", value: true },
          { label: "Disabled", value: false },
        ],
      },
      cardHeight: {
        show: function (layout) {
          return !!layout.pageSettings.customCardDimensions;
        },
        ref: "pageSettings.cardHeight",
        component: "slider",
        type: "integer",
        label: "Define the height (px) for all cards",
        defaultValue: 442,
        min: 0,
        max: 1000,
        step: 1,
      },
      cardWidth: {
        show: function (layout) {
          return !!layout.pageSettings.customCardDimensions;
        },
        ref: "pageSettings.cardWidth",
        component: "slider",
        type: "integer",
        label: "Define the width (px) for all cards",
        defaultValue: 300,
        min: 0,
        max: 1000,
        step: 1,
      },
      logoImage: {
        type: "string",
        label: "Logo Image",
        component: "media",
        ref: "pageSettings.logoMedia",
        layoutRef: "pageSettings.logoMedia",
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
  };

  const menuItems = {
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
        component: "switch",
        ref: "isComingSoon",
        label: "Coming soon banner:",
        defaultValue: false,
        options: [
          { label: "Enabled", value: true },
          { label: "Disabled", value: false },
        ],
      },
      ribbonLabel: {
        type: "string",
        ref: "ribbonLabel",
        label: "Ribbon Label",
        defaultValue: "IN DEVELOPMENT",
      },
      ribbonColor: {
        type: "string",
        component: "dropdown",
        ref: "ribbonColor",
        label: "Ribbon Color",
        defaultValue: "ribbon-blue",
        options: [
          { label: "Blue", value: "ribbon-blue" },
          { label: "Red", value: "ribbon-red" },
          { label: "Gray", value: "ribbon-grey" },
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
      coverImageMedia: {
        type: "string",
        label: "Or choose from library: ",
        component: "media",
        ref: "coverImageMedia",
        layoutRef: "coverImageMedia",
      },
      isFlippable: {
        type: "boolean",
        ref: "isFlippable",
        label: "Card flip",
        component: "switch",
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
      clickToFollowLink: {
        type: "boolean",
        ref: "clickToFollowLink",
        label: "Click anywhere to open link",
        component: "switch",
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
        component: "switch",
        label: "'VISIT' button",
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
  };

  const aboutSection = {
    type: "items",
    translation: "About",
    items: {
      about: {
        component: "About",
        translation: "About",
      },
    },
  };

  return {
    type: "items",
    component: "accordion",
    items: {
      pageSettings,
      menuItems,
      aboutSection,
    },
  };
});
