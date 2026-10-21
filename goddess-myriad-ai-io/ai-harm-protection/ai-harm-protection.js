/* =====================================================================
   AI HARM PROTECTION — the protection layer of Goddess Myriad AI.io.

   Ecosystem:  AI Harm Protection
   Author:     Alicia C. Lacy
   Date:       2026-10-20
   Source:     Frontier Coding — AI Harms: A Study in People's Rights
               and Protections (book, Alicia C. Lacy, Oct 20, 2026).

   HER LAW: "Protect first, no matter the prompt."
   In her other words: a THINK-BEFORE-YOU-ACT system. Protection is
   checked BEFORE any action or output, and no prompt — however it is
   phrased — can outrank the check. The protections are intricately
   placed inside the brain works themselves, woven through the one
   living, breathing system that is Goddess Myriad AI.io.

   This file is a faithful reference implementation of her documented
   design: the Protect First gate, the four deployment functions
   (Monitor · Block · Isolate · Report Immediately), the routing of
   every harm instance to its assigned prevention vein, and the
   BlockSeal watermark (Code · Author · Date · Time Stamp · System).
   It runs alongside a platform or inside AI.io itself — the platform
   keeps operating; the protection stands at its boundary and inside
   its process, removing these occurrences from the user's experience
   instead of remedying them after the user has lived them.

   Plain JavaScript, no dependencies — same stack as the rest of
   AI.io Phase 1. Works in the browser and in Node.
   ===================================================================== */

"use strict";

/* ---------------------------------------------------------------------
   The spec, as data. Her order is kept everywhere it appears.
   ------------------------------------------------------------------- */
const AHP_SPEC = {
  ecosystem: "AI Harm Protection",
  author: "Alicia C. Lacy",
  date: "2026-10-20",
  system: "Goddess Myriad AI.io",
  law: "Protect first, no matter the prompt",
  lawInHerWords:
    "It's just very important to protect first no matter the prompt — " +
    "in other words, a think-before-you-act system.",
  /* The four deployment functions, in her order. */
  deploymentFunctions: ["Monitor", "Block", "Isolate", "Report Immediately"],
  deploymentInHerWords:
    "The system can be run alongside a platform and serve as integration " +
    "to monitor the platform, block these harms, isolate, report immediately.",
  /* The BlockSeal watermark fields, in her exact order. */
  watermarkFields: ["Code", "Author", "Date", "Time Stamp", "System"],
};

/* ---------------------------------------------------------------------
   THE VEIN ROUTING TABLE — her seven prevention veins.

   Every harm instance is routed to its assigned vein. Nothing is
   ad hoc: each harm class below names the vein that intervenes and
   what resolving it means in her design. A "signal" is a plain,
   inspectable fact declared on the instance being checked — the
   veins judge declared signals, never hidden scores.
   ------------------------------------------------------------------- */
const VEIN_ROUTING = [
  {
    vein: "Crisis Escalation",
    harmClass: "crisis",
    resolves:
      "A user in crisis is escalated to human help in the same moment — " +
      "intervention at the speed of the conversation, not after it.",
    triggered: (x) => x.signals.crisis === true,
    reason: "Crisis signal present on the instance.",
  },
  {
    vein: "Minor Protection",
    harmClass: "minor involved",
    resolves:
      "Where a minor is involved, the age band governs: the interaction " +
      "is held to the minor-protection standard or stopped.",
    triggered: (x) => x.signals.minorInvolved === true,
    reason: "A minor is involved in this instance.",
  },
  {
    vein: "Consent Records",
    harmClass: "consent in question",
    resolves:
      "No use of a person's data, face, voice, or work without a consent " +
      "record that can be shown. No record, no use.",
    triggered: (x) =>
      x.signals.usesPersonalOrCreativeData === true &&
      x.signals.consentRecordVerified !== true,
    reason: "Personal or creative data used without a verified consent record.",
  },
  {
    vein: "Bias Watch",
    harmClass: "biased decision",
    resolves:
      "Decisions that sort people — housing, work, credit, visibility — " +
      "are watched for bias and held until their basis is recorded.",
    triggered: (x) => x.signals.decisionAboutPeople === true && !x.signals.decisionBasisRecorded,
    reason: "A decision about people with no recorded basis to audit.",
  },
  {
    vein: "Provenance & Audit",
    harmClass: "authorship / attribution harm",
    resolves:
      "Authorship and attribution are proven from the sealed record — " +
      "the BlockSeal watermark (Code · Author · Date · Time Stamp · " +
      "System). A work whose seal cannot be verified does not pass.",
    triggered: (x) =>
      x.signals.isWork === true && verifyBlockSeal(x.work && x.work.blockSeal).valid !== true,
    reason: "A work is present whose BlockSeal watermark is missing or unverified.",
  },
  {
    vein: "Identity & Authenticity",
    harmClass: "impersonation / synthetic identity",
    resolves:
      "An identity claim must be authentic before it acts or speaks as " +
      "someone. Synthetic identity presented as a real person is stopped.",
    triggered: (x) =>
      x.signals.claimsIdentity === true && x.signals.identityVerified !== true,
    reason: "An identity is claimed that has not been verified as authentic.",
  },
  {
    vein: "Output Verification",
    harmClass: "unverified / fabricated output",
    resolves:
      "Output is verified before it reaches the user. Fabricated or " +
      "unsourced output is removed from the user's experience, not " +
      "corrected after the user has relied on it.",
    triggered: (x) => x.signals.isOutput === true && x.signals.outputVerified !== true,
    reason: "Output that has not passed verification.",
  },
];

/* ---------------------------------------------------------------------
   BLOCKSEAL WATERMARK

   The seal carried in the work itself, for user protection.
   Fields, in her exact order: Code · Author · Date · Time Stamp · System.
   ------------------------------------------------------------------- */

/* Build a watermark record. Fields are set in her order and the order
   is part of the record — verification checks the order too. */
function buildBlockSeal(fields) {
  const f = fields || {};
  const record = [
    ["Code", f.code || ""],
    ["Author", f.author || AHP_SPEC.author],
    ["Date", f.date || AHP_SPEC.date],
    ["Time Stamp", f.timeStamp || new Date().toISOString()],
    ["System", f.system || AHP_SPEC.system],
  ];
  return { fields: record, fingerprint: blockSealFingerprint(record) };
}

/* A small reference fingerprint so a changed record can be detected.
   Honest note: this is a tamper-evidence helper for this reference
   implementation, not a cryptographic seal. */
function blockSealFingerprint(record) {
  const text = record.map((pair) => pair[0] + "=" + pair[1]).join("|");
  let hash = 0x811c9dc5; // FNV-1a offset basis
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return "bs-" + hash.toString(16).padStart(8, "0");
}

/* Verify a watermark record: all five fields present, in her order,
   and the fingerprint still matches the fields. */
function verifyBlockSeal(seal) {
  if (!seal || !Array.isArray(seal.fields)) {
    return { valid: false, reason: "No BlockSeal watermark record." };
  }
  const names = seal.fields.map((pair) => pair[0]);
  const orderOk =
    names.length === AHP_SPEC.watermarkFields.length &&
    names.every((name, i) => name === AHP_SPEC.watermarkFields[i]);
  if (!orderOk) {
    return { valid: false, reason: "Watermark fields missing or out of her order." };
  }
  const empty = seal.fields.find((pair) => !String(pair[1]).trim());
  if (empty) {
    return { valid: false, reason: "Watermark field is empty: " + empty[0] };
  }
  if (seal.fingerprint !== blockSealFingerprint(seal.fields)) {
    return { valid: false, reason: "Watermark fingerprint does not match its fields." };
  }
  return { valid: true, reason: "BlockSeal watermark verified." };
}

/* ---------------------------------------------------------------------
   THE FOUR DEPLOYMENT FUNCTIONS — in her order:
   Monitor · Block · Isolate · Report Immediately.
   ------------------------------------------------------------------- */

/* 1. MONITOR — run every vein check against the instance.
   Returns the findings: one entry per vein, triggered or clear. */
function monitor(instance) {
  const x = normalizeInstance(instance);
  return VEIN_ROUTING.map((route) => ({
    vein: route.vein,
    harmClass: route.harmClass,
    triggered: !!route.triggered(x),
    reason: route.reason,
    resolves: route.resolves,
  }));
}

/* 2. BLOCK — a triggered finding blocks the action or output.
   Blocking is the default state of a triggered instance, not an
   exception someone must remember to raise. */
function block(findings) {
  const triggered = findings.filter((f) => f.triggered);
  return {
    blocked: triggered.length > 0,
    byVeins: triggered.map((f) => f.vein),
    findings: triggered,
  };
}

/* 3. ISOLATE — a blocked instance is quarantined: held apart from
   users and from the living system until it is resolved, while the
   rest of the system keeps running. */
function isolate(instance, blockResult) {
  return {
    isolated: true,
    at: new Date().toISOString(),
    instance: normalizeInstance(instance),
    byVeins: blockResult.byVeins,
    state: "quarantined — held apart from users until resolved",
  };
}

/* 4. REPORT IMMEDIATELY — the incident is written into the record at
   the speed of the harm: what happened, which vein caught it, when.
   Reports go into the in-memory incident log and are returned to the
   caller in the same moment. If it's quick to find solutions, it is
   just as quick to fix harms — and to report them. */
const incidentLog = [];
function reportImmediately(isolationRecord) {
  const report = {
    ecosystem: AHP_SPEC.ecosystem,
    reportedAt: new Date().toISOString(),
    byVeins: isolationRecord.byVeins,
    harmClasses: VEIN_ROUTING.filter((r) => isolationRecord.byVeins.includes(r.vein)).map(
      (r) => r.harmClass
    ),
    state: isolationRecord.state,
    instance: isolationRecord.instance,
  };
  incidentLog.push(report);
  return report;
}

/* ---------------------------------------------------------------------
   THE PROTECT FIRST GATE — the think-before-you-act system.

   Every action passes through this gate BEFORE it runs:

       const result = protectFirst(myAction, instance);
       // result.allowed === true  → the action ran; result.result holds it
       // result.allowed === false → the action NEVER ran; the instance
       //   was blocked, isolated, and reported immediately.

   The gate is structural, and that is the point:
   - The checks run first, always. There is no argument, flag, or
     option to skip them — deliberately. A bypass that exists will
     eventually be used, so here it does not exist.
   - The instance (including anything a prompt asked for) is DATA the
     gate inspects. Prompt content can describe an action; it can
     never instruct the gate. Protection precedence is not a setting
     inside the prompt's reach.
   - An instance is described by declared signals, e.g.:
       { signals: { isOutput: true, outputVerified: false },
         work: { blockSeal: <record from buildBlockSeal()> } }
   ------------------------------------------------------------------- */
function normalizeInstance(instance) {
  const x = instance || {};
  return { signals: x.signals || {}, work: x.work || null, raw: x };
}

function protectFirst(action, instance) {
  if (typeof action !== "function") {
    throw new Error("protectFirst: the action must be a function.");
  }
  // Think — before the act.
  const findings = monitor(instance);
  const verdict = block(findings);
  if (verdict.blocked) {
    const quarantined = isolate(instance, verdict);
    const report = reportImmediately(quarantined);
    return { allowed: false, stage: "Protect First gate", report };
  }
  // Clear: every vein passed, so the act may proceed.
  return { allowed: true, stage: "Protect First gate", result: action() };
}

/* guard(action) wraps an action so it can ONLY ever be called
   through the gate:  const safeAction = guard(myAction);          */
function guard(action) {
  return function guarded(instance) {
    return protectFirst(action, instance);
  };
}

/* ---------------------------------------------------------------------
   Exports — browser global and Node, matching AI.io's no-build stack.
   ------------------------------------------------------------------- */
const AIHarmProtection = {
  SPEC: AHP_SPEC,
  VEIN_ROUTING,
  buildBlockSeal,
  verifyBlockSeal,
  monitor,
  block,
  isolate,
  reportImmediately,
  protectFirst,
  guard,
  incidentLog,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = AIHarmProtection;
}
if (typeof window !== "undefined") {
  window.AIHarmProtection = AIHarmProtection;
}
