const REQUIRED = ["SUPABASE_URL", "SUPABASE_KEY"];

REQUIRED.forEach(k => {
  if (!process.env[k]) {
    console.error(`❌ Missing ENV: ${k}`);
    process.exit(1);
  }
});
