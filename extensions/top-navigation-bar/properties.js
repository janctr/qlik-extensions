define(["qlik"], function (qlik) {
  const sheets = qlik.navigation.sheets.map(
    ({ qInfo: { qId }, qMeta: { title } }) => ({ label: title, value: qId })
  );

  const itemsDefinition = {
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
      items: {
        label: {
          type: "string",
          ref: "label",
          label: "Label",
        },
        menuItemType: {
          type: "string",
          component: "dropdown",
          ref: "itemType",
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
          ],
        },
        href: {
          type: "string",
          ref: "href",
          label: "URL",
          show: function (x) {
            console.log(x);
            return x.itemType === "web-link";
          },
        },
        sheet: {
          type: "string",
          component: "dropdown",
          ref: "sheetId",
          label: "Sheet",
          defaultValue: 0,
          options: sheets,
          show: function (x) {
            return x.itemType === "sheet-link";
          },
        },
      },
    },
  };

  const itemsDefinitionWithChildren = JSON.parse(
    JSON.stringify(itemsDefinition)
  );

  itemsDefinitionWithChildren.menuItems.items.children = {
    type: "array",
    translation: "Sub Menu Items",
    min: 1,
    allowAdd: true,
    allowRemove: true,
    allowMove: true,
    addTranslation: "Add Sub Menu Item",
    grouped: true,
    items: JSON.parse(JSON.stringify(itemsDefinition)),
  };

  console.log("itemsDefinitionWithChildren: ", itemsDefinitionWithChildren);

  const properties = {
    definition: {
      type: "items",
      component: "accordion",
      items: itemsDefinition,
    },
  };
  return properties;
});
