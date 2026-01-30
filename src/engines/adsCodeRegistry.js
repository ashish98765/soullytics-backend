const fs = require("fs");
const path = require("path");
const supabase = require("../config/supabaseClient");

async function loadAdsCodes() {
  const registry = {};
  const enginesDir = __dirname;
  const files = fs.readdirSync(enginesDir);

  for (const file of files) {
    if (!file.startsWith("adsCode") || !file.endsWith(".js")) continue;

    const engineName = file.replace(".js", "");

    const { data } = await supabase
      .from("engine_scores")
      .select("disabled")
      .eq("engine_name", engineName)
      .single();

    if (data?.disabled) {
      console.log(`⛔ Engine disabled: ${engineName}`);
      continue;
    }

    const imported = require(path.join(enginesDir, file));
    registry[engineName] =
      typeof imported === "function"
        ? imported
        : imported[Object.keys(imported)[0]];
  }

  return registry;
}

module.exports = loadAdsCodes();
