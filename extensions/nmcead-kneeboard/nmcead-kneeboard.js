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

  function createCellHash({ id, division, unitName, columnName }) {
    return [id, division, unitName, columnName].join(" - ");
  }

  function figureOutColor({
    value,
    iconSet,
    condition1,
    condition2,
    condition3,
  }) {
    console.log(
      "figureOutColor:",
      value,
      iconSet,
      condition1,
      condition2,
      condition3
    );

    if (!iconSet) {
      return "";
    }

    const colors = iconSet.split(",");
    const conditions = [condition1, condition2, condition3].filter(
      (condition) => !!condition
    ); // Takes out condition 3 if not there

    console.log("colors: ", colors);
    console.log("conditions: ", conditions);
    // Using >=

    for (let i = 0; i < conditions.length; i++) {
      if (value >= conditions[i]) return colors[i];
    }

    return colors.slice(-1); // Return the last color
  }

  function getTableRules(tableJoinDimensions) {
    const missionsAndManningJoinDimensions = [
      "missionsAndManningID",
      "missionsAndManningDivision",
      "missionsAndManningUnitName",
      "columnHeader",
      "value",
      "ruleId",
      "iconSet",
      "condition1",
      "condition2",
      "condition3",
    ].map((column) => {
      return {
        qNullSupression: false,
        qDef: { qFieldDefs: [column] },
      };
    });

    return new Promise((resolve, reject) => {
      qlik.currApp().createCube(
        {
          qDimensions: missionsAndManningJoinDimensions,
          qMeasure: [],
          qInitialDataFetch: [
            {
              qWidth: missionsAndManningJoinDimensions.length,
              qHeight: 700,
            },
          ],
        },
        (response) => {
          const headers = response.qHyperCube.qDimensionInfo.map(
            ({ qFallbackTitle }) => qFallbackTitle
          );
          const matrix = response.qHyperCube.qDataPages[0].qMatrix;

          const VALUE_INDEX = headers.indexOf("value");
          const ICON_SET_INDEX = headers.indexOf("iconSet");
          const CONDITION_1_INDEX = headers.indexOf("condition1");
          const CONDITION_2_INDEX = headers.indexOf("condition2");
          const CONDITION_3_INDEX = headers.indexOf("condition3");

          const cellRuleMap = new Map();

          const cells = [];
          for (const row of matrix) {
            const cellObject = {};
            let currentHeaderIndex = 0;

            for (const col of row) {
              let value;

              if (col.qIsNull) {
                value = null;
              } else if (col.qNum === "NaN") {
                value = col.qText;
              } else {
                value = col.qNum;
              }

              cellObject[headers[currentHeaderIndex]] = value;

              currentHeaderIndex++;
            }

            // Determine color
            const cellObjectHash = createCellHash({
              id: cellObject[headers[0]],
              division: cellObject[headers[1]],
              unitName: cellObject[headers[2]],
              columnName: cellObject[headers[3]],
            });

            const cellConditionFormatting = figureOutColor({
              value: cellObject[headers[VALUE_INDEX]],
              iconSet: cellObject[headers[ICON_SET_INDEX]],
              condition1: cellObject[headers[CONDITION_1_INDEX]],
              condition2: cellObject[headers[CONDITION_2_INDEX]],
              condition3: cellObject[headers[CONDITION_3_INDEX]],
            });

            cellRuleMap.set(cellObjectHash, cellConditionFormatting);

            cells.push(cellObject);
          }

          resolve({ cellRuleMap });
        }
      );
    });
  }

  function getTableRowsProto(tableDimensions, headers) {
    // This prototype returns all rows in a table.
    // The forma is a 1-dimensional array filled with objects, with each object representing a row
    qlik.currApp().createCube(
      {
        qDimensions: missionsAndMannigJoinDimensions,
        qMeasure: [],
        qInitialDataFetch: [
          {
            qWidth: missionsAndMannigJoinDimensions.length,
            qHeight: 1000,
          },
        ],
      },
      (reply) => {
        console.log("prototype: ", reply);
      }
    );
  }

  function getRowsProto(division, hyperCube, dimensions) {}

  function getTableRows(tableDimensions, headers, divisions) {
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
    console.log("getRowd data: ", data);
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

        /* PROTOTYPE: Missions/Manning Table */
        getTableRules()
          .then(({ cellRuleMap }) => {
            console.log("getTableRules: ", reply);
          })
          .catch((err) => {
            console.log("ERROR!!: ", err);
          });
      },
    ],
  };
});
