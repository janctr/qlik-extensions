define(["qlik"], function (qlik) {
  const appId = qlik.currApp().id;

  const sheets = qlik.navigation.sheets.map(
    ({ qInfo: { qId }, qMeta: { title } }) => ({ label: title, value: qId })
  );

  function exportDataToClipboard(data) {
    const { pageSettings, menuItems } = data;

    // Export object to clipboard
    // {
    //   pageSettings,
    //   menuItems
    // }
    const json = JSON.stringify({
      pageSettings,
      menuItems,
    });
    navigator.clipboard.writeText(json).then(() => {
      alert("Successfully copied to clipboard");
    });
  }

  function importDataFromClipboard({ qInfo: { qId } }) {
    const backendApi = window.backendApi[qId];

    navigator.clipboard.readText().then((json) => {
      const data = JSON.parse(json);

      const { pageSettings, menuItems } = data;

      backendApi.getProperties().then(function (reply) {
        if (pageSettings) reply.pageSettings = pageSettings;
        if (menuItems) reply.menuItems = menuItems;

        console.log("setting properties: ", reply);
        backendApi.setProperties(reply);
      });
    });
  }

  function getObjectId(layout) {
    // You can use this to target elements specific to an object
    return layout.qInfo.qId;
  }

  function getObjectTitleId(layout) {
    // `header#${layout.qInfo.qId}_title` - targets the area at the top that leave unwanted whitespace;
    return `${layout.qInfo.qId}_title`;
  }

  function getObjectContentId(layout) {
    // `#${layout.qInfo.qId}_content` - targets the body of the object
    return `${layout.qInfo.qId}_content`;
  }

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

  function navigateToSheet(sheetId) {
    qlik.navigation.gotoSheet(sheetId);
  }

  function navigateToUrl(url) {
    window.location = url;
  }

  function navigateToUrlInNewTab(url) {
    window.open(url, "_blank");
  }

  return {
    appId,
    sheets,
    exportDataToClipboard,
    importDataFromClipboard,
    isWebLink,
    isSheetLink,
    isNotLink,
    getSheetUrl,
    getHref,
    getBackgroundImageUrl,
    getObjectId,
    getObjectContentId,
    getObjectTitleId,
    makeClassFromTitle,
    navigateToSheet,
    navigateToUrl,
    navigateToUrlInNewTab,
  };
});
