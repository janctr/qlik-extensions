define([
  "qlik",
  "jquery",
  "text!./style.css",
  "text!./missions-table-grid-styles.css",
  "text!./template.html",
  "./missionsAndManning",
], function (
  qlik,
  $,
  cssContent,
  missionsTableStyles,
  template,
  missionsAndManningProperties
) {
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
          .slice(2)
          .map((value) => (value.qNum === "NaN" ? value.qText : value.qNum));
        // .filter((value) => value !== "EAD" && value !== "CWD");
      });

    console.log("formattedRows: ", formattedRows.flat());

    return formattedRows.flat();
  }

  const missionAndManningDims =
    missionsAndManningProperties.missionsAndManningColumns;

  return {
    template: template,
    initialProperties: {
      qHyperCubeDef: {
        qDimensions: [...missionAndManningDims],
        qMeasures: [],
        qInitialDataFetch: [
          {
            qWidth: missionAndManningDims.length,
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
        $scope.missionsAndManningsHeaders = {
          headers: missionsAndManningProperties.headers,
          missionCaps: missionsAndManningProperties.missionCaps,
          maintenanceCaps: missionsAndManningProperties.maintenanceCaps,
          unitTeamManning: missionsAndManningProperties.unitTeamManning,
        };

        $scope.eadRows = getRows("EAD", $scope.layout.qHyperCube);
        $scope.cwdRows = getRows("CWD", $scope.layout.qHyperCube);

        $scope.setCurrentTab = function setCurrentTab(tab) {
          $scope.currentTab = tab;
        };

        $scope.currentTab = 2;

        $scope.isCurrentTab = function (tab) {
          return tab === $scope.currentTab;
        };
      },
    ],
  };
});
