/** Experimental. Ctrl + F 'this' */

define(["qlik"], function (qlik) {
  const sheets = qlik.navigation.sheets.map(
    ({ qInfo: { qId }, qMeta: { title } }) => ({ label: title, value: qId })
  );

  function isWebLink(x) {
    return x.linkType === "web-link";
  }

  function isSheetLink(x) {
    return x.linkType === "sheet-link";
  }

  function isItemGroup(x) {
    return x.isGroup === "item-group";
  }

  function isNotItemGroup(x) {
    return !(x.isGroup === "item-group");
  }

  const labelComponent = {
    type: "string",
    ref: "label",
    label: "Label",
  };

  const hrefComponent = {
    type: "string",
    ref: "href",
    label: "URL",
    show: isWebLink,
  };

  const sheetLinkComponent = {
    type: "string",
    component: "dropdown",
    ref: "sheetId",
    label: "Sheet",
    defaultValue: 0,
    options: sheets,
    show: isSheetLink,
  };

  const isGroupComponent = {
    type: "string",
    component: "radiobuttons",
    ref: "isGroup",
    label: "Menu Item Type",
    defaultValue: "item",
    options: [
      {
        value: "item",
        label: "Item",
      },
      {
        value: "item-group",
        label: "Group",
      },
    ],
  };

  const menuItemTypeComponent = {
    type: "string",
    component: "dropdown",
    ref: "linkType",
    label: "Link Type",
    /** If this is an item group it shouldn't show up */
    show: isNotItemGroup,
    options: [
      {
        label: "Sheet Link",
        value: "sheet-link",
      },
      {
        label: "Website URL",
        value: "web-link",
      },
    ],
  };

  const linkComponent = {
    type: "string",
    ref: "link",
    label: "Link",
  };

  //   const submenuComponent = {
  //     // An array of menuItems
  //     show: function (x) {
  //       return x.isGroup === "item-group";
  //     },
  //     type: "array",
  //     translation: "Sub Menu Items",
  //     ref: "submenu",
  //     min: 1,
  //     allowAdd: true,
  //     allowRemove: true,
  //     allowmove: true,
  //     addTranslation: "Add Item",
  //     grouped: true,
  //     itemTitleRef: "label",
  //     items: menuItemComponent,
  //   };

  const menuItemComponent = {
    // Can either be a submenu or a link
    label: labelComponent,
    isGroup: isGroupComponent,
    link: linkComponent,
    submenu: {
      // An array of menuItems
      show: function (x) {
        return x.isGroup === "item-group";
      },
      type: "array",
      translation: "Sub Menu Items",
      ref: "submenu",
      min: 1,
      allowAdd: true,
      allowRemove: true,
      allowmove: true,
      addTranslation: "Add Item",
      grouped: true,
      itemTitleRef: "label",
      items: this,
    },
  };

  const menu = {
    menuItems: {
      type: "array",
      translation: "Menu Items",
      ref: "menuItems",
      min: 1,
      allowAdd: true,
      allowRemove: true,
      allowMove: true,
      addTranslation: "Add Item",
      grouped: true,
      itemTitleRef: "label",
      items: menuItemComponent,
    },
  };

  const properties = {
    definition: {
      type: "items",
      component: "accordion",
      items: menu,
    },
  };
  return properties;
});
