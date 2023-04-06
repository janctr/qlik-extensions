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
                  className: row.className + " " + cellColorClass,
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

  function flatten(arr) {
    return arr.flat();
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

  const missionAndManningDims = missionsAndManningProperties.dimensions;
  const infrastructureDims = infrastructureProperties.dimensions;

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
        $scope.setCurrentTab = function setCurrentTab(tab) {
          $scope.currentTab = tab;
        };

        $scope.currentTab = 2;

        $scope.isCurrentTab = function (tab) {
          return tab === $scope.currentTab;
        };

        /* Missions/Manning Table data*/
        $scope.missionsAndManningsHeaders =
          missionsAndManningProperties.headers;

        $scope.missionsAndManningRows = flatten(
          [
            ...getRows("EAD", $scope.layout.qHyperCube),
            ...getRows("CWD", $scope.layout.qHyperCube),
          ].map((row, index) => {
            const cellColorClass = index % 2 !== 0 ? "cell-gray" : "cell-white";

            return row.map((cell) => {
              return {
                value: cell.value,
                className: cell.className + " " + cellColorClass,
              };
            });
          })
        );

        $scope.missionsAndManningRowsEadCount = getRowCount(
          "EAD",
          $scope.layout.qHyperCube
        );
        $scope.missionsAndManningRowsCwdCount = getRowCount(
          "CWD",
          $scope.layout.qHyperCube
        );

        /* Infrastructure Table data */
        qlik.currApp().createCube(
          {
            qDimensions: infrastructureDims,
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

            $scope.infrastructureRows = flatten(
              [
                ...getRows("EAD", reply.qHyperCube),
                ...getRows("CWD", reply.qHyperCube),
              ].map((row, index) => {
                const cellColorClass =
                  index % 2 !== 0 ? "cell-gray" : "cell-white";

                return row.map((cell) => {
                  return {
                    value: cell.value,
                    className: cell.className + " " + cellColorClass,
                  };
                });
              })
            );

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
