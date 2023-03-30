define([
  "qlik",
  "jquery",
  "text!./style.css",
  "text!./template.html",
], function (qlik, $, cssContent, template) {
  "use strict";
  $("<style>").html(cssContent).appendTo("head");

  function getRows(division, hyperCube) {
    const data = hyperCube.qDataPages[0].qMatrix;

    console.log("data: ", data);

    const formattedRows = data
      .filter((row) => {
        return row[1].qText === division; // This is where the division column is
      })
      .map((datum) => {
        return datum
          .slice(1)
          .map((value) => (value.qNum === "NaN" ? value.qText : value.qNum))
          .filter((value) => value !== "EAD" && value !== "CWD");
      });

    console.log("formattedRows: ", formattedRows.flat());

    return formattedRows.flat();
  }
  return {
    template: template,
    initialProperties: {
      qHyperCubeDef: {
        qDimensions: [
          { qNullSupression: false, qDef: { qFieldDefs: ["ID"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["division"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["unitName"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["overallStatus"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["missionVLS"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["missionCLS"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["missionSM"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["missionVLA"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["missionTLAM"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["missionHWT"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["missionLWT"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["missionMINES"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["missionBOMBS"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["missionROCKETS"] } },
          {
            qNullSupression: false,
            qDef: { qFieldDefs: ["missionAirMissiles"] },
          },
          {
            qNullSupression: false,
            qDef: { qFieldDefs: ["missionSonoBuoys"] },
          },
          {
            qNullSupression: false,
            qDef: { qFieldDefs: ["missionSmallArms"] },
          },
          { qNullSupression: false, qDef: { qFieldDefs: ["missionRSSI"] } },
          {
            qNullSupression: false,
            qDef: { qFieldDefs: ["missionTransport"] },
          },
          {
            qNullSupression: false,
            qDef: { qFieldDefs: ["missionArmedHelo"] },
          },
          { qNullSupression: false, qDef: { qFieldDefs: ["missionQRT"] } },
          {
            qNullSupression: false,
            qDef: { qFieldDefs: ["maintenanceQuickStrikeMine"] },
          },
          { qNullSupression: false, qDef: { qFieldDefs: ["maintenanceSLMM"] } },
          {
            qNullSupression: false,
            qDef: { qFieldDefs: ["maintenanceREXTORP"] },
          },
          { qNullSupression: false, qDef: { qFieldDefs: ["maintenanceESSM"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["maintenanceSM"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["maintenanceTLAM"] } },
          {
            qNullSupression: false,
            qDef: { qFieldDefs: ["maintenanceVLAAUR"] },
          },
          { qNullSupression: false, qDef: { qFieldDefs: ["maintenanceLWT"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["MIL"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["CIV"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["MLC"] } },
          { qNullSupression: false, qDef: { qFieldDefs: ["FDNH"] } },
        ],
        qMeasures: [],
        qInitialDataFetch: [
          {
            qWidth: 33,
            qHeight: 100,
          },
        ],
      },
    },
    definition: {
      type: "items",
      component: "accordion",
      items: {
        dimensions: {
          uses: "dimensions",
          min: 0,
        },
        measures: {
          uses: "measures",
          min: 0,
        },
        sorting: {
          uses: "sorting",
        },
        settings: {
          uses: "settings",
          items: {
            initFetchRows: {
              ref: "qHyperCubeDef.qInitialDataFetch.0.qHeight",
              label: "Initial fetch rows",
              type: "number",
              defaultValue: 50,
            },
          },
        },
      },
    },
    support: {
      snapshot: true,
      export: true,
      exportData: true,
    },
    paint: function () {
      //setup scope.table
      if (!this.$scope.table) {
        this.$scope.table = qlik.table(this);
      }
      return qlik.Promise.resolve();
    },
    controller: [
      "$scope",
      function ($scope) {
        const missionCaps = [
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
        ];
        const maintenanceCaps = [
          "Quick Strike Mine",
          "SLMM",
          "REXTORP",
          "ESSM",
          "SM",
          "TLAM ",
          "VLA AUR ",
          "LWT",
        ];
        const unitTeamManning = ["MIL", "CIV", "MLC", "FDNH"];

        const fields = [
          // Mission Caps fields
          //   "unitName",
          "overallStatus",
          "vls",
          "cls",
          "missionCapsSm", // Column name same as maintenanceCapsSm
          "vla",
          "tlam",
          "hwt",
          "lwt",
          "mines",
          "bombs",
          "rockets",
          "airMissiles",
          "sonoBuoys",
          "smallArms",
          "rssi",
          "transport",
          "armedHelo",
          "qrt",

          // Maintenance Caps fields
          "quickStrikeMine",
          "slmm",
          "rextorp",
          "essm",
          "maintenanceCapsSm",
          "maintenanceCapsTlam",
          "vlaAur",
          "lwt",

          // Unit/Team Manning
          "mil",
          "civ",
          "mlc",
          "fdnh",
        ];

        const eadRows = [];
        const cwdRows = [];

        for (const unitName of [
          "Pearl Harbor",
          "Guam",
          "QRT 1",
          "QRT 1",
          "QRT 3",
          "MAT 1",
          "MAT 2",
          "AHT 1",
          "AHT 2",
          "Yokosuka",
          "Atsugi",
          "Sasebo",
          "Misawa",
          "Okinawa",
          "MAT 1",
          "MAT 2",
          "Diego Garcia",
        ]) {
          eadRows.push(unitName);

          for (let i = 0; i < 30; i++) {
            eadRows.push(0);
          }
        }

        for (const unitName of [
          "Seal Beach",
          "QRT 1",
          "North Island",
          "QRT 1",
          "Point Loma",
          "Indian Island",
        ]) {
          cwdRows.push(unitName);

          for (let i = 0; i < 30; i++) {
            cwdRows.push(0);
          }
        }

        console.log("eadRows: ", eadRows);

        $scope.missionCaps = missionCaps;
        $scope.maintenanceCaps = maintenanceCaps;
        $scope.unitTeamManning = unitTeamManning;

        $scope.eadRows = getRows("EAD", $scope.layout.qHyperCube);
        $scope.cwdRows = getRows("CWD", $scope.layout.qHyperCube);
      },
    ],
  };
});
