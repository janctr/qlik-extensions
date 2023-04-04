define(["qlik"], function (qlik) {
  "use strict";

  const quickResponseTeamTableHeaders = [
    { className: "empty", value: "" },
    { className: "title", value: "NMCPAC QUICK RESPONSE TEAM" },
    { className: "unit-name", value: "UNIT NAME" },
    { className: "overall-status vertical-text", value: "OVERALL STATUS" },
    {
      className: "man",
      value: "MAN",
    },
    ...[
      {
        className: "man-10-of-10 vertical-text",
        value: "10 OF 10",
      },
      {
        className: "man-greater-than-2 vertical-text",
        value: "> 2",
      },
    ],
    {
      className: "train",
      value: "TRAIN",
    },
    ...[
      {
        className: "vls vertical-text",
        value: "VLS",
      },
      {
        className: "cls vertical-text",
        value: "CLS",
      },
      {
        className: "barge-ops vertical-text",
        value: "BARGE OPS",
      },
      {
        className: "qual-or-cert vertical-text",
        value: "QUAL/CERT",
      },
    ],
    {
      className: "equip",
      value: "EQUIP (1/1 PER TEAM)",
    },
    ...[
      {
        className: "vls-ohe vertical-text",
        value: "VLS OHE",
      },
      {
        className: "cls-ohe vertical-text",
        value: "CLS OHE",
      },
      {
        className: "ssn-vls-platform vertical-text",
        value: "SSN VLS PLATFORM",
      },
      {
        className: "redline-other vertical-text",
        value: "REDLINE/OTHER",
      },
    ],
  ];

  const dimensions = [
    "qrtID",
    "qrtDivision",
    "qrtUnitName",
    "qrtOverallStatus",
    "man10of10",
    "manGreatThan2",
    "trainVLS",
    "trainCLS",
    "trainBargeOps",
    "trainQualOrCert",
    "equipVLSOHE",
    "equipCLSOHE",
    "equipSSNVLSPlatform",
    "equipRedlineOrOther",
  ].map((column) => {
    return {
      qNullSupression: false,
      qDef: { qFieldDefs: [column] },
    };
  });

  return {
    headers: quickResponseTeamTableHeaders,
    dimensions,
  };
});
