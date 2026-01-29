# SpendGuard Backend  
### Powered by Soullytics Decision Engine

SpendGuard is an AI-powered **decision firewall for paid advertising**.

It evaluates ad performance data and returns **one clear, explainable action**:
**RUN, PAUSE, KILL, or SCALE**.

This backend exists to **protect ad spend**, stop emotional decisions, and enforce budget discipline.

---

## 🎯 What SpendGuard Does

SpendGuard is NOT:
- an ad generator
- an analytics dashboard
- a reporting tool

SpendGuard IS:
- a decision system
- a risk evaluator
- a spend-protection layer

Given ad data, it decides **whether ads should continue at all**.

---

## 🧠 Core Principles

### 1. Decision > Data
SpendGuard does not overwhelm users with metrics.
It returns **one decision** and explains it.

### 2. Explainability First
Every decision includes:
- confidence score
- risk score
- human-readable reasons
- actionable prescriptions

### 3. Deterministic Logic
The same input always produces the same output.
No black-box randomness.

---

## 🏗️ Architecture Overview
src/ ├── core/ │   ├── decisionEngine.js │   ├── decisionOrchestrator.js │   ├── explainabilityEngine.js │   ├── prescriptionEngine.js │ ├── engines/ │   ├── adscode01.objectiveClarity.js │   ├── adscode02.budgetReality.js │   ├── adscode03.platformSelection.js │   ├── ... │   └── adscodeXX.finalComposer.js │ ├── routes/ │   └── decision.routes.js │ ├── middleware/ │   ├── apiKeyAuth.js │   └── usageGuard.js │ ├── utils/ │   └── validators.js │ └── index.js

---

## 🔐 Authentication

All requests require an API key.

Send the key in request headers:

Requests without a valid key are rejected.

---

## 📡 API Endpoint

### POST `/api/v1/decision`

#### Headers

#### Request Body Example

```json
{
  "platform": "meta",
  "raw": {
    "ctr": 0.7,
    "cpa": 720,
    "spend": 1500,
    "conversions": 3
  },
  "budget": 300,
  "minimumBudget": 1000,
  "expectedCPA": 700
}


#### Response

{
  "success": true,
  "data": {
    "action": "PAUSE",
    "confidence": 0.42,
    "risk": 0.68,
    "reasons": [
      "Budget too low",
      "CPA higher than expected"
    ],
    "trace": {}
  },
  "usage": {
    "used": 14,
    "limit": 50
  }
}

