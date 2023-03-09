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
        isGroup: {
          type: "string",
          component: "radiobuttons",
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
          ref: "isGroup",
          label: "Menu Item Type",
        },
        label: {
          type: "string",
          ref: "label",
          label: "Label",
        },
        /******************* Children ******************** */
        itemGroup: {
          type: "array",
          ref: "childMenuItems",
          show: function (x) {
            console.log("itemGroup show: ", x);

            return x.isGroup === "item-group";
          },
          grouped: true,
          allowAdd: true,
          allowRemove: true,
          allowMove: true,
          translation: "Menu Items",
          addTranslation: "Add Item",
          itemTitleRef: "label",
          items: {
            isGroup: {
              type: "string",
              component: "radiobuttons",
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
              ref: "isGroup",
              label: "Menu Item Type",
            },
            label: {
              type: "string",
              ref: "label",
              label: "Label",
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
              ],
            },
            href: {
              type: "string",
              ref: "href",
              label: "URL",
              show: function (x) {
                console.log(x);
                return x.linkType === "web-link";
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
                return x.linkType === "sheet-link";
              },
            },
          },
        },
        /*******************************************************************/
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
          ],
        },
        href: {
          type: "string",
          ref: "href",
          label: "URL",
          show: function (x) {
            console.log(x);
            return x.linkType === "web-link";
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
            return x.linkType === "sheet-link";
          },
        },
      },
    },
  };

  const properties = {
    definition: {
      type: "items",
      component: "accordion",
      items: itemsDefinition,
    },
  };
  return properties;
});
