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

  function getTableRows(tableDimensions, headers, divisions) {
    console.log("getTableRows");

    return new Promise((resolve, reject) => {
      qlik.currApp().createCube(
        {
          qDimensions: tableDimensions,
          qMeasures: [],
          qInitialDataFetch: [
            {
              qWidth: tableDimensions.length,
              qHeight: 100,
            },
          ],
        },
        (reply) => {
          const flatRows = divisions
            .map((division) => getRows(division, reply.qHyperCube))
            .flat()
            .map((divisionRows, index) => {
              // Set the class names
              const cellColorClass =
                index % 2 !== 0 ? "cell-gray" : "cell-white";

              return divisionRows.map((row) => {
                return {
                  value: row.value,
                  className: [
                    row.className,
                    cellColorClass,
                    getColor(row),
                  ].join(" "),
                };
              });
            })
            .flat();

          const rowCounts = divisions.map((division) =>
            getRowCount(division, reply.qHyperCube)
          );

          resolve({
            headers,
            rows: flatRows,
            rowCounts,
          });
        }
      );
    });
  }

  function getRows(division, hyperCube) {
    const data = hyperCube.qDataPages[0].qMatrix;

    const rows = [];

    for (const [index, row] of data
      .filter((row) => row[1].qText === division)
      .entries()) {
      const rowWithoutIdAndDivision = row.slice(2);

      const formattedRow = rowWithoutIdAndDivision.map((value) =>
        value.qNum === "NaN" ? value.qText : value.qNum
      );

      rows.push(
        formattedRow.map((cell, index) => {
          const classes = ["cell"];
          if (index === 0) classes.push("sticky-left");

          return {
            value: cell,
            className: classes.join(" "),
          };
        })
      );
    }

    return rows;
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

  // Functions to determine cell color
  function getColor(cellValue) {
    const { value } = cellValue;

    if (isNaN(Number(value))) return "";

    // TODO: Get range of number

    if (value > 90) return "cell-green";
    else if (value > 80) return "cell-yellow";
    else if (value > 1) return "cell-red";
    return "cell-empty";
  }

  return {
    template: template,
    initialProperties: {
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
        qInitialDataFetch: [
          {
            qWidth: 0,
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
        $scope.setCurrentTab = function setCurrentTab(tab) {
          $scope.currentTab = tab;
        };

        $scope.currentTab = 2;

        $scope.isCurrentTab = function (tab) {
          return tab === $scope.currentTab;
        };

        $scope.getCellDisplayValue = function (value) {
          if (typeof value === "string") return value;
          return "";
        };

        /* Missions/Manning Table data*/
        const missionAndManningDims = missionsAndManningProperties.dimensions;
        const missionsAndManningHeaders = missionsAndManningProperties.headers;

        getTableRows(missionAndManningDims, missionsAndManningHeaders, [
          "EAD",
          "CWD",
        ]).then(({ headers, rows, rowCounts }) => {
          $scope.missionsAndManningsHeaders = headers;
          $scope.missionsAndManningRows = rows;

          $scope.missionsAndManningRowsEadCount = rowCounts[0];
          $scope.missionsAndManningRowsCwdCount = rowCounts[1];
        });

        /* Infrastructure Table data */
        const infrastructureDims = infrastructureProperties.dimensions;
        const infrastructureHeaders = infrastructureProperties.headers;
        getTableRows(infrastructureDims, infrastructureHeaders, [
          "EAD",
          "CWD",
        ]).then(({ headers, rows, rowCounts }) => {
          $scope.infrastructureHeaders = headers;
          $scope.infrastructureRows = rows;

          $scope.infrastructureRowsEadCount = rowCounts[0];
          $scope.infrastructureRowsCwdCount = rowCounts[1];
        });

        /* QRT Table data */
        const quickResponseTeamDims = quickResponseTeamProperties.dimensions;
        const quickResponseTeamHeaders = quickResponseTeamProperties.headers;

        getTableRows(quickResponseTeamDims, quickResponseTeamHeaders, [
          "EAD",
          "CWD",
          "HOME GROWN",
        ]).then(({ headers, rows, rowCounts }) => {
          $scope.quickResponseTeamHeaders = headers;
          $scope.quickResponseTeamRows = rows;
          $scope.quickResponseTeamRowsEadCount = rowCounts[0];
          $scope.quickResponseTeamRowsCwdCount = rowCounts[1];
          $scope.quickResponseTeamRowHomeGrownCount = rowCounts[2];
        });
      },
    ],
  };
});
