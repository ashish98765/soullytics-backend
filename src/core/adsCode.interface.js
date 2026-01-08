// src/core/adsCode.interface.js

/**
 * Base interface for all Ads Codes (1–19)
 * Every Ads Code MUST follow this structure
 */

class AdsCode {
  constructor(context) {
    this.context = context;
  }

  /**
   * Each Ads Code must implement this
   */
  run() {
    throw new Error("run() method not implemented");
  }
}

module.exports = { AdsCode };
