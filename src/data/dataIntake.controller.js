// src/data/dataIntake.controller.js

const googleSchema = require("./schemas/google.schema");
const metaSchema = require("./schemas/meta.schema");

const normalizeGoogle = require("./normalizers/google.normalizer");
const normalizeMeta = require("./normalizers/meta.normalizer");

function validate(schema, raw) {
  const errors = [];

  for (const key of schema.required) {
    if (raw[key] === undefined || raw[key] === null) {
      errors.push(`MISSING_${key.toUpperCase()}`);
    }
  }

  for (const key of schema.numeric) {
    if (raw[key] !== undefined && !Number.isFinite(Number(raw[key]))) {
      errors.push(`NON_NUMERIC_${key.toUpperCase()}`);
    }
  }

  return errors;
}

module.exports = function dataIntakeController({ platform, raw }) {
  try {
    if (!platform || !raw) {
      return { ok: false, errors: ["PLATFORM_OR_RAW_MISSING"] };
    }

    if (platform === "google") {
      const errors = validate(googleSchema, raw);
      if (errors.length) return { ok: false, errors };
      return { ok: true, metrics: normalizeGoogle(raw) };
    }

    if (platform === "meta") {
      const errors = validate(metaSchema, raw);
      if (errors.length) return { ok: false, errors };
      return { ok: true, metrics: normalizeMeta(raw) };
    }

    return { ok: false, errors: ["UNSUPPORTED_PLATFORM"] };
  } catch (e) {
    return { ok: false, errors: ["INTAKE_CRASH", e.message] };
  }
};
