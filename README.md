# Soullytics Backend 🧠

Soullytics is an AI-powered decision firewall for paid advertising.

Instead of blindly spending money, Soullytics evaluates campaigns
across 50+ decision engines before allowing execution.

## What Soullytics Does

- Analyzes campaign objectives, budget, platform & risk
- Runs 50+ independent decision engines
- Produces a single clear action:
  - RUN
  - PAUSE
  - KILL
- Explains *why* the decision was made

This system is designed to **prevent waste before it happens**.

---

## API: Campaign Decision

### POST /api/decision

Evaluates an ad campaign and returns a decision.

### Required Fields

| Field | Type |
|------|------|
| objective | string |
| platform | string |
| budget | number |
| metrics | object |

### Response

```json
{
  "action": "PAUSE",
  "confidence": 0.42,
  "risk": "MEDIUM",
  "reasons": [],
  "trace": {}
}
