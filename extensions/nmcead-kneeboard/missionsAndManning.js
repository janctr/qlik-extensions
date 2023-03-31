define(["qlik"], function (qlik) {
  "use strict";

  const missionsAndManningColumns = [
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
  ].map((column) => {
    return {
      qNullSupression: false,
      qDef: { qFieldDefs: [column] },
    };
  });

  console.log("missionsAndManing: ", missionsAndManningColumns);

  return {
    missionsAndManningColumns,
  };
});
