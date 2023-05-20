define(["qlik"], function (qlik) {
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
  };
});
