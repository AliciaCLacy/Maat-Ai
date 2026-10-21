/* =====================================================================
   FORMULA COMPTRIX — the brain's detection-to-formula record.

   System:     Goddess Myriad AI.io
   Author:     Alicia C. Lacy
   Date:       2026-10-20

   HER WORDS: "Mathematical computations to formula. My system is
   tied into the copy right patent systems.. my system detects new
   models and creations formulas systems etc.. by matching brain of
   six nacis patent dms etc. Now.. once my systems brain detects it..
   it clearly makes the formula mathematically."

   What this is, in her design: the system is tied into the copyright
   and patent systems. The brain watches for new models, creations,
   formulas, and systems, and detects them BY MATCHING — in her term,
   matching brain of six nacis patent dms. On a detection, the system
   does not just flag it: it clearly makes the formula mathematically
   — the computations become the formula — and issues a Formula
   Comptrix record with her fields, in her order:

       Date · Time stamp · Patent Type · Creator name · Summary ·
       Uses · Examples · Industry

   ("Industry" is her clarification, 2026-10-20: every record is
   classified by industry.)

   This file is a faithful reference implementation of that design.
   Matching is by DECLARED, INSPECTABLE signals only — shared terms
   and shared formula structure, scored by one stated computation —
   no hidden scores and no invented machine learning. It stands
   beside BlockSeal in the same provenance machinery: BlockSeal
   seals her works at creation; Formula Comptrix detects, formulates,
   and records what the brain matches in the field.

   Its records also serve her larger purpose, in her words: "This
   too will help future builds for industry technology the
   information is used to gauge economics gdp and new industry and
   phased out industries." Dated and industry-tagged, the records
   aggregate into the gauge (see aggregateByIndustry below).

   Plain JavaScript, no dependencies — same stack as the rest of
   AI.io Phase 1. Works in the browser and in Node.
   ===================================================================== */

"use strict";

/* ---------------------------------------------------------------------
   The spec, as data. Her order is kept everywhere it appears.
   ------------------------------------------------------------------- */
const FC_SPEC = {
  record: "Formula Comptrix",
  author: "Alicia C. Lacy",
  date: "2026-10-20",
  system: "Goddess Myriad AI.io",
  herTerm: "six nacis patent dms",
  herWords:
    "Mathematical computations to formula. My system is tied into the " +
    "copy right patent systems.. my system detects new models and " +
    "creations formulas systems etc.. by matching brain of six nacis " +
    "patent dms etc. Now.. once my systems brain detects it.. it " +
    "clearly makes the formula mathematically.",
  /* The record's fields, in her exact order (Industry clarified). */
  recordFields: [
    "Date",
    "Time stamp",
    "Patent Type",
    "Creator name",
    "Summary",
    "Uses",
    "Examples",
    "Industry",
  ],
  /* The one stated match computation: M = t + 2s.
     t = shared terms; s = shared formula-structure terms.
     A match is declared at M >= MIN_MATCH_SCORE. */
  minMatchScore: 2,
};

/* ---------------------------------------------------------------------
   Term handling. Terms are declared text — a candidate's and a known
   record's names, terms, and keywords, lowered to a plain word set.
   Stopwords are removed so matching turns on substance, not filler.
   ------------------------------------------------------------------- */
const STOPWORDS = new Set([
  "a", "an", "the", "of", "and", "or", "to", "in", "on", "for",
  "with", "by", "etc", "system", "systems",
]);

function tokenize(text) {
  const terms = new Set();
  if (!text) return terms;
  String(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .forEach((w) => {
      if (w && !STOPWORDS.has(w)) terms.add(w);
    });
  return terms;
}

function termsOf(descriptor) {
  const terms = new Set();
  [descriptor.name, descriptor.title, descriptor.terms, descriptor.keywords]
    .forEach((part) => tokenize(part).forEach((t) => terms.add(t)));
  if (Array.isArray(descriptor.uses)) {
    descriptor.uses.forEach((u) => tokenize(u).forEach((t) => terms.add(t)));
  }
  return terms;
}

/* Formula structure is a declared list of structure terms — for her
   formulas, the named variables and operators of the computation
   (e.g. a valuation formula's ISV · ERV · CSP · EPV · TNV). */
function structureOf(descriptor) {
  const raw = descriptor.formulaStructure || descriptor.structure || [];
  const list = Array.isArray(raw) ? raw : String(raw).split(/[^A-Za-z0-9]+/);
  return new Set(list.map((s) => String(s).trim().toUpperCase()).filter(Boolean));
}

function shared(a, b) {
  return [...a].filter((x) => b.has(x)).sort();
}

/* ---------------------------------------------------------------------
   DETECT — the brain matching, in her design.

   detect(candidate, brainRecords) compares one candidate creation
   descriptor against the brain's known records and returns the
   matches, strongest first. Every match carries its signals in the
   open: the shared terms, the shared formula structure, and the
   score from the one stated computation, M = t + 2s.

   candidate:     { name, terms|keywords, formulaStructure,
                    patentType, creatorName, summary, uses,
                    examples, industry }   (all fields optional but name)
   brain record:  { title|name, terms|keywords, formulaStructure,
                    patentType, creatorName|author, summary, uses,
                    examples, industry, formula }
   ------------------------------------------------------------------- */
function detect(candidate, brainRecords, options) {
  const minScore =
    options && typeof options.minMatchScore === "number"
      ? options.minMatchScore
      : FC_SPEC.minMatchScore;
  const cTerms = termsOf(candidate || {});
  const cStruct = structureOf(candidate || {});
  const matches = [];

  (brainRecords || []).forEach((record) => {
    const sharedTerms = shared(cTerms, termsOf(record));
    const sharedStruct = shared(cStruct, structureOf(record));
    const t = sharedTerms.length;
    const s = sharedStruct.length;
    const score = t + 2 * s; // M = t + 2s — the stated computation.
    if (score >= minScore && score > 0) {
      matches.push({
        candidate,
        record,
        score,
        sharedTerms,
        sharedFormulaTerms: sharedStruct,
        formula: "M = t + 2s = " + t + " + 2·" + s + " = " + score,
      });
    }
  });

  return matches.sort((a, b) => b.score - a.score);
}

/* ---------------------------------------------------------------------
   BUILD — issue the Formula Comptrix record for a detection.

   The record carries her eight fields, in her order — and ONLY those
   fields, in that order. Creator name defaults to the matched
   record's creator; Date and Time stamp are generated at issue.
   Anything not declared anywhere is marked TODO (Alicia) rather
   than invented, per her rules.
   ------------------------------------------------------------------- */
function pick() {
  for (let i = 0; i < arguments.length; i++) {
    const v = arguments[i];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}

function buildFormulaComptrix(match, details) {
  details = details || {};
  const candidate = match.candidate || {};
  const record = match.record || {};
  const now = new Date();

  const summary = pick(
    details.summary,
    record.summary,
    candidate.summary,
    "Detection: \"" +
      pick(candidate.name, candidate.title, "candidate") +
      "\" matches the brain's record \"" +
      pick(record.title, record.name, "creation") +
      "\" — signals: shared terms [" +
      match.sharedTerms.join(", ") +
      "], shared formula structure [" +
      match.sharedFormulaTerms.join(", ") +
      "], " +
      match.formula +
      "."
  );

  /* Keys are inserted in her order — Date first, Industry last. */
  const comptrix = {};
  comptrix["Date"] = now.toISOString().slice(0, 10);
  comptrix["Time stamp"] = now.toISOString();
  comptrix["Patent Type"] = pick(
    details.patentType,
    record.patentType,
    candidate.patentType,
    "TODO (Alicia)"
  );
  comptrix["Creator name"] = pick(
    details.creatorName,
    record.creatorName,
    record.author,
    candidate.creatorName,
    "Alicia C. Lacy"
  );
  comptrix["Summary"] = summary;
  comptrix["Uses"] = pick(details.uses, candidate.uses, record.uses, []);
  comptrix["Examples"] = pick(
    details.examples,
    candidate.examples,
    record.examples,
    []
  );
  comptrix["Industry"] = pick(
    details.industry,
    record.industry,
    candidate.industry,
    "TODO (Alicia)"
  );
  return comptrix;
}

/* ---------------------------------------------------------------------
   RENDER — the formula, mathematically, and the record in her order.

   The mathematical statement comes first: if the matched creation
   declares its own formula, it is stated as hers; the detection
   computation is stated as the formula that produced the match.
   Then the record, field by field, in her order.
   ------------------------------------------------------------------- */
function renderFormula(comptrix, match) {
  const lines = [];
  lines.push("FORMULA COMPTRIX");
  if (match && match.record && match.record.formula) {
    lines.push("Formula: " + match.record.formula);
  }
  if (match && match.formula) {
    lines.push("Detection formula: " + match.formula);
  }
  lines.push("");
  FC_SPEC.recordFields.forEach((field) => {
    const value = comptrix[field];
    const shown = Array.isArray(value) ? value.join("; ") : value;
    lines.push(field + ": " + shown);
  });
  return lines.join("\n");
}

/* The pipeline in one call: detect, and for the strongest match,
   build and render the record. Returns null when nothing matches —
   no detection, no record. */
function detectAndRecord(candidate, brainRecords, details, options) {
  const matches = detect(candidate, brainRecords, options);
  if (!matches.length) return null;
  const record = buildFormulaComptrix(matches[0], details);
  return { match: matches[0], matches, record, rendered: renderFormula(record, matches[0]) };
}

/* ---------------------------------------------------------------------
   AGGREGATE — the gauging layer of her design.

   HER WORDS: "This too will help future builds for industry
   technology the information is used to gauge economics gdp and
   new industry and phased out industries."

   Every Formula Comptrix record is dated and industry-tagged, so
   the records aggregate into industry telemetry: counted by
   industry, and by year within each industry. Read over time, the
   counts show movement — industries where detections are rising
   (new industries forming), industries where they are falling
   (industries phasing out) — the gauge her system keeps on
   economics and GDP movement, and the information that feeds
   future builds for industry technology.

   This is honest, mechanical aggregation: counting records,
   nothing more. No modeling, no forecasting is claimed here —
   the gauge reads what the brain has put on record.
   ------------------------------------------------------------------- */
function aggregateByIndustry(records) {
  const byIndustry = {};
  (records || []).forEach((record) => {
    const industry = record["Industry"] || "TODO (Alicia)";
    const date = record["Date"] || "";
    const year = /^\d{4}/.test(date) ? date.slice(0, 4) : "undated";
    if (!byIndustry[industry]) {
      byIndustry[industry] = { count: 0, byYear: {} };
    }
    byIndustry[industry].count += 1;
    byIndustry[industry].byYear[year] =
      (byIndustry[industry].byYear[year] || 0) + 1;
  });
  return byIndustry;
}

/* ---------------------------------------------------------------------
   TREND — the forecast layer of her design ("Forecast also").

   trendByIndustry reads the same dated, industry-tagged records
   and, per industry, compares the count in the EARLIER half of the
   record window against the LATER half, labelling the trajectory:

       later > earlier  ->  "rising"     (a new industry forming)
       later = earlier  ->  "steady"
       later < earlier  ->  "declining"  (an industry phasing out)

   HONEST BY CONSTRUCTION — her Truth Standard: this is a FORECAST
   computed from the documented record, labelled forecast, not
   fact. It is a mechanical extrapolation of counts already on
   record — dated records only, split at the window's midpoint —
   and it claims nothing beyond that arithmetic. Where an industry
   has too few dated records to split, the label says so.
   ------------------------------------------------------------------- */
function trendByIndustry(records) {
  const dated = {};
  (records || []).forEach((record) => {
    const date = record["Date"] || "";
    if (!/^\d{4}-\d{2}-\d{2}/.test(date)) return; // dated records only
    const industry = record["Industry"] || "TODO (Alicia)";
    if (!dated[industry]) dated[industry] = [];
    dated[industry].push(date);
  });

  const trends = {};
  Object.keys(dated).forEach((industry) => {
    const dates = dated[industry].slice().sort();
    if (dates.length < 2) {
      trends[industry] = {
        label: "insufficient dated records",
        earlier: dates.length,
        later: 0,
        forecast: true,
      };
      return;
    }
    const start = Date.parse(dates[0]);
    const end = Date.parse(dates[dates.length - 1]);
    const midpoint = start + (end - start) / 2;
    let earlier = 0;
    let later = 0;
    dates.forEach((d) => {
      if (Date.parse(d) <= midpoint) earlier += 1;
      else later += 1;
    });
    const label =
      later > earlier ? "rising" : later < earlier ? "declining" : "steady";
    trends[industry] = { label, earlier, later, forecast: true };
  });
  return trends;
}

/* Node export (guarded — the browser simply keeps the globals). */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    FC_SPEC,
    detect,
    buildFormulaComptrix,
    renderFormula,
    detectAndRecord,
    aggregateByIndustry,
    trendByIndustry,
  };
}
