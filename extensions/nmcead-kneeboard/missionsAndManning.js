define(["qlik"], function (qlik) {
  "use strict";

  const headers = [
    { className: "empty", value: "" },
    { className: "title", value: "NMCPAC MISSIONS/MANNING" },
    { className: "unit-name", value: "UNIT NAME" },
    { className: "overall-status vertical-text", value: "OVERALL STATUS" },
    {
      className: "mission-caps",
      value: "MISSION CAPS",
    },
    ...[
      "VLS",
      "CLS",
      "SM",
      "VLA",
      "TLAM",
      "HWT",
      "LWT",
      "MINES",
      "BOMBS",
      "ROCKETS",
      "Air Missiles",
      "SONOBUOYS",
      "SMALL ARMS",
      "RSSI",
      "TRANSPORT",
      "ARMED HELO",
      "QRT",
    ].map((missionCapItem, index) => ({
      className: `mission-cap-item-${index + 1} vertical-text`,
      value: missionCapItem,
    })),
    { className: "maintenance-caps", value: "MAINTENANCE CAPS" },
    {
      className: "intermediate",
      value: "Intermediate",
    },
    ...["Quick Strike Mine", "SLMM", "REXTORP"].map((item, index) => ({
      className: `intermediate-item-${index + 1} vertical-text`,
      value: item,
    })),
    {
      className: "limited",
      value: "Limited",
    },
    ...["ESSM", "SM", "TLAM ", "VLA AUR ", "LWT"].map((item, index) => ({
      className: `limited-item-${index + 1} vertical-text`,
      value: item,
    })),
    {
      className: "unit-team-manning",
      value: "Unit/Team Manning",
    },
    ...["MIL", "CIV", "MLC", "FDNH"].map((item) => ({
      className: `${item.toLowerCase()} vertical-text`,
      value: item,
    })),
  ];

  const dimensions = [
    "missionsAndManningID",
    "missionsAndManningDivision",
    "missionsAndManningUnitName",
    "missionsAndManningOverallStatus",
    "missionVLS",
    "missionCLS",
    "missionSM",
    "missionVLA",
    "missionTLAM",
    "missionHWT",
    "missionLWT",
    "missionMINES",
    "missionBOMBS",
    "missionROCKETS",
    "missionAirMissiles",
    "missionSonoBuoys",
    "missionSmallArms",
    "missionRSSI",
    "missionTransport",
    "missionArmedHelo",
    "missionQRT",
    "maintenanceQuickStrikeMine",
    "maintenanceSLMM",
    "maintenanceREXTORP",
    "maintenanceESSM",
    "maintenanceSM",
    "maintenanceTLAM",
    "maintenanceVLAAUR",
    "maintenanceLWT",
    "MIL",
    "CIV",
    "MLC",
    "FDNH",
    // "iconSet",
    // "condition1",
    // "condition2",
    // "condition3",
  ].map((column) => {
    return {
      qNullSupression: false,
      qDef: { qFieldDefs: [column] },
    };
  });

  return {
    dimensions,
    headers,
  };
});
