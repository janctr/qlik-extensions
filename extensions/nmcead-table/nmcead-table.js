define([
  "qlik",
  "jquery",
  "text!./style.css",
  "text!./template.html",
], function (qlik, $, cssContent, template) {
  "use strict";
  $("<style>").html(cssContent).appendTo("head");
  return {
    template: template,
    initialProperties: {
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
        qInitialDataFetch: [
          {
            qWidth: 10,
            qHeight: 50,
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
          min: 1,
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

        $scope.missionCaps = missionCaps;
        $scope.maintenanceCaps = maintenanceCaps;
        $scope.unitTeamManning = unitTeamManning;

        $scope.eadRows = eadRows;
        $scope.cwdRows = cwdRows;
      },
    ],
  };
});
