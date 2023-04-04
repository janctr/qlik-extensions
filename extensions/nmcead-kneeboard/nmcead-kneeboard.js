define([
  "qlik",
  "jquery",
  "text!./style.css",
  "text!./missions-table-grid-styles.css",
  "text!./infrastructure-table-grid-styles.css",
  "text!./qrt-table-grid-styles.css",
  "text!./template.html",
  "./missionsAndManning",
  "./infrastructure",
  "./quickResponseTeam",
], function (
  qlik,
  $,
  mainCssContent,
  missionsTableStyles,
  infrastructureTableStyles,
  quickResponseTeamTableStyles,
  template,
  missionsAndManningProperties,
  infrastructureProperties,
  quickResponseTeamProperties
) {
  "use strict";
  [
    mainCssContent,
    missionsTableStyles,
    infrastructureTableStyles,
    quickResponseTeamTableStyles,
  ].forEach((cssContent) => {
    $("<style>").html(cssContent).appendTo("head");
  });

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

  function getRowCount(division, hyperCube) {
    const data = hyperCube.qDataPages[0].qMatrix;

    const formattedRows = data
      .filter((row) => {
        return row[1].qText === division; // This is where the division column is
      })
      .map((datum) => {
        return datum
          .slice(2)
          .map((value) => (value.qNum === "NaN" ? value.qText : value.qNum));
      });

    console.log("row count: ", formattedRows.length);

    return formattedRows.length;
  }

  const missionAndManningDims = missionsAndManningProperties.dimensions;
  const infrastructureDims = infrastructureProperties.dimensions;
  const quickResponseTeamDims = quickResponseTeamProperties.dimensions;

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
      console.log("this.backendApi: ", this.backendApi);
      //setup scope.table
      if (!this.$scope.table) {
        this.$scope.table = qlik.table(this);
      }
      return qlik.Promise.resolve();
    },
    controller: [
      "$scope",
      function ($scope) {
        $scope.missionsAndManningsHeaders =
          missionsAndManningProperties.headers;

        $scope.eadRows = getRows("EAD", $scope.layout.qHyperCube);
        $scope.cwdRows = getRows("CWD", $scope.layout.qHyperCube);

        $scope.setCurrentTab = function setCurrentTab(tab) {
          $scope.currentTab = tab;
        };

        $scope.currentTab = 2;

        $scope.isCurrentTab = function (tab) {
          return tab === $scope.currentTab;
        };

        // infrastructureHyperCube
        qlik.currApp().createCube(
          {
            qDimensions: [...infrastructureDims],
            qMeasures: [],
            qInitialDataFetch: [
              {
                qWidth: infrastructureDims.length,
                qHeight: 100,
              },
            ],
          },
          (reply) => {
            console.log("infrastructure hypercube: ", reply);
            $scope.infrastructureHeaders = infrastructureProperties.headers;

            $scope.infrastructureRowsEad = getRows("EAD", reply.qHyperCube);
            $scope.infrastructureRowsCwd = getRows("CWD", reply.qHyperCube);

            $scope.infrastructureRowsEadCount = getRowCount(
              "EAD",
              reply.qHyperCube
            );
            $scope.infrastructureRowsCwdCount = getRowCount(
              "CWD",
              reply.qHyperCube
            );
          }
        );

        // quickResponseTeam
        qlik.currApp().createCube(
          {
            qDimensions: [...quickResponseTeamDims],
            qMeasures: [],
            qInitialDataFetch: [
              {
                qWidth: quickResponseTeamDims.length,
                qHeight: 100,
              },
            ],
          },
          (reply) => {
            console.log("quickResponseTeam hypercube: ", reply);
            $scope.quickResponseTeamHeaders =
              quickResponseTeamProperties.headers;

            $scope.quickResponseTeamRowsEad = getRows("EAD", reply.qHyperCube);
            $scope.quickResponseTeamRowsCwd = getRows("CWD", reply.qHyperCube);
            $scope.quickResponseTeamRowsHomeGrown = getRows(
              "HOME GROWN",
              reply.qHyperCube
            );

            $scope.quickResponseTeamRowsEadCount = getRowCount(
              "EAD",
              reply.qHyperCube
            );
            $scope.quickResponseTeamRowsCwdCount = getRowCount(
              "CWD",
              reply.qHyperCube
            );
            $scope.quickResponseTeamRowHomeGrownCount = getRowCount(
              "HOME GROWN",
              reply.qHyperCube
            );
          }
        );
      },
    ],
  };
});
