define(["qlik"], function (qlik) {
  "use strict";

  const infrastructureTableHeaders = [
    { className: "empty", value: "" },
    { className: "title", value: "NMCPAC INFRASTRUCTURE" },
    { className: "unit-name", value: "UNIT NAME" },
    { className: "overall-status vertical-text", value: "OVERALL STATUS" },
    {
      className: "ohe",
      value: "OHE",
    },

    ...[
      {
        className: "ohe-vls vertical-text",
        value: "VLS",
      },
      {
        className: "ohe-cls vertical-text",
        value: "CLS",
      },
    ],
    {
      className: "platform",
      value: "PLATFORM",
    },
    ...[
      {
        className: "platform-vbpt vertical-text",
        value: "VBPT",
      },
      {
        className: "platform-la vertical-text",
        value: "LA",
      },
    ],
    {
      className: "mhe",
      value: "MHE",
    },
    ...[
      {
        className: "mhe-4k-forklift vertical-text",
        value: "4k FORKLIFT",
      },
      {
        className: "mhe-6k-forklift vertical-text",
        value: "6k FORKLIFT",
      },
      {
        className: "mhe-8k-forklift vertical-text",
        value: "8k FORKLIFT",
      },
      {
        className: "mhe-10k-forklift vertical-text",
        value: "10k FORKLIFT",
      },
      {
        className: "mhe-12k-forklift vertical-text",
        value: "12k FORKLIFT",
      },
      {
        className: "mhe-15k-forklift vertical-text",
        value: "15k FORKLIFT",
      },
      {
        className: "mhe-20k-forklift vertical-text",
        value: "20k FORKLIFT",
      },
    ],
    {
      className: "whe",
      value: "WHE",
    },
    ...[
      {
        className: "whe-60t-cranes vertical-text",
        value: "60 T CRANES",
      },
      {
        className: "whe-100t-cranes vertical-text",
        value: "100 T CRANES",
      },
    ],
    {
      className: "cese",
      value: "CESE",
    },
    ...[
      {
        className: "cese-10k-truck vertical-text",
        value: "10K Truck",
      },
      {
        className: "cese-15k-truck vertical-text",
        value: "15K Truck",
      },
    ],
    {
      className: "load-facilities",
      value: "LOAD FACILITIES",
    },
    ...[
      {
        className: "wharfs vertical-text",
        value: "WHARFS",
      },
      {
        className: "anchorage vertical-text",
        value: "ANCHORAGE",
      },
      {
        className: "barges vertical-text",
        value: "BARGES",
      },
    ],
    {
      className: "critical-degradations",
      value: "CRTIICAL DEGRADATIONS",
    },
    ...[
      {
        className: "critical-degradation-1 vertical-text",
        value: "",
      },
      {
        className: "critical-degradation-2 vertical-text",
        value: "",
      },
      {
        className: "critical-degradation-3 vertical-text",
        value: "",
      },
      {
        className: "critical-degradation-4 vertical-text",
        value: "",
      },
      {
        className: "critical-degradation-5 vertical-text",
        value: "REDLINE/OTHER",
      },
    ],
  ];

  const dimensions = [
    "infrastructureID",
    "infrastructureDivision",
    "infrastructureUnitName",
    "infrastructureOverallStatus",
    "oheVLS",
    "oheCLS",
    "platformVBPT",
    "platformLA",
    "mhe4kForklift",
    "mhe6kForklift",
    "mhe8kForklift",
    "mhe10kForklift",
    "mhe12kForklift",
    "mhe15kForklift",
    "mhe20kForklift",
    "whe60TCranes",
    "whe100TCranes",
    "cese10kTruck",
    "cese15kTruck",
    "loadFacilitiesWHARFS",
    "loadFacilitiesAnchorage",
    "loadFacilitiesBarges",
    "criticalDegradations1",
    "criticalDegradations2",
    "criticalDegradations3",
    "criticalDegradations4",
    "criticalDegradationsRedlineOrOther",
  ].map((column) => {
    return {
      qNullSupression: false,
      qDef: { qFieldDefs: [column] },
    };
  });

  return {
    headers: infrastructureTableHeaders,
    dimensions,
  };
});
