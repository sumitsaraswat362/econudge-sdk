<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Deciduous%20Tree.png" alt="Tree" width="60" />
  <h1 align="center">EcoNudge SDK</h1>
  <p align="center">
    <strong>The sustainability layer for every digital platform.</strong><br/>
    <em>Built for GreenHack 2026</em>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white" alt="WebGL" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

---

## 🏆 The Problem & Our Solution
**The Problem:** Millions of digital transactions happen daily (ride bookings, food delivery, shopping). Consumers *want* to be sustainable, but calculating their carbon footprint is too complex and friction-heavy.

**The Solution:** The **EcoNudge SDK**. A drop-in widget that intercepts a user's action at the exact point of decision, calculates the environmental impact in milliseconds, and suggests gamified, greener alternatives.

---

## ✨ Screenshots (The Live Experience)

### 1. The Landing Experience
The portal features an immersive, reactive WebGL breathing background that dynamically shifts based on the user's "Eco-Health".
<img src="./assets/Home.png" width="100%" alt="Home Page" />

### 2. Live Demo: Real-Time SDK Interception
We simulated real-world integrations (Mock Uber/Zomato/Amazon). When a user clicks "Book Ride", our engine calculates the CO₂ footprint and triggers the drop-in Nudge Modal.
<img src="./assets/Book%20Ride.png" width="100%" alt="Book Ride Widget" />
<img src="./assets/Booke%20ride%202%20.png" width="100%" alt="Book Ride UI" />

### 3. Gamification: Impact Dashboard & City Wars
Users track their lifetime carbon savings through a Tamagotchi-style "Virtual Pet" tree and compete in a real-time leaderboard ("City Wars").
<img src="./assets/Impact%20Dashboard.png" width="100%" alt="Impact Dashboard" />
<img src="./assets/Impct%20Dashboard%202%20.png" width="100%" alt="Gamification" />

### 4. Carbon Offset Marketplace
Users can spend their gamified "EcoPoints" to fund real-world sustainability projects.
<img src="./assets/Market.png" width="100%" alt="Offset Marketplace" />

### 5. Corporate ESG Admin (B2B Dashboard)
Companies integrating the SDK get a powerful, automated dashboard tracking their platform's carbon offset, user conversion rates, and SDG alignment for compliance.
<img src="./assets/Corporate%20admin.png" width="100%" alt="Corporate Admin" />

---

## 🧠 System Architecture

We designed EcoNudge to be blazingly fast and highly scalable, utilizing Next.js App Router, Server-Sent Events (SSE) for live feeds, and an AI-driven predictive calculation engine.

```mermaid
graph TD
    subgraph "Client Applications (Partners)"
        A[Uber / Zomato Checkout] --> B(EcoNudge Widget)
        B -->|Voice API / Haptics| C{User Interaction}
    end

    subgraph "EcoNudge Cloud Infrastructure"
        D[Next.js App Router]
        E[Carbon Calc Engine]
        F[Live SSE Feed Generator]
        
        B -- POST /api/nudge/calculate --> D
        D --> E
        E -->|Emission Factors| G[(Emission Datasets)]
        E -->|Analogies & Scores| H[AI Suggestion Module]
        
        D -- GET /api/live-feed --> F
        F -.->|Streams live stats| B
    end

    subgraph "Admin & Enterprise"
        I[Corporate Dashboard]
        J[Marketplace Engine]
        D -- GET /api/esg/report --> I
        C -- "Uses EcoPoints" --> J
    end
    
    H --> D
```

---

## ⚡ Technical Masterpieces (What Judges Should Know)

We didn't just build a UI. We engineered a massive, interconnected system:

1. **Complex Calculation Engine:** We mapped over **1,000+ data points** (food varieties, clothing materials, vehicle modes) and their exact CO₂/Km or CO₂/Meal coefficients.
2. **WebGL Dynamic Biome:** The background isn't a video. It's a `react-three-fiber` sphere running custom shaders that physically "breathes" and shifts colors in real-time based on your sustainability ratio.
3. **Web Speech API & Audio Context:** Users can book a ride using their voice (the mic icon constantly listens). Interactions are paired with organic, synthesized sound effects (water drops, chimes) using the Web Audio API to prevent heavy asset loading.
4. **Local State Persistence & Predictive Modeling:** The dashboard uses predictive algorithms to forecast the user's 5-year carbon trajectory, securely persisting all state locally.
5. **Generative AI Report:** A built-in LLM simulation generates long-form, highly personalized textual reports on the user's micro-habits.

---

## 🚀 How to Run Locally

1. Clone the repo and install dependencies:
```bash
npm install
```
2. Start the development server:
```bash
npm run dev
```
3. Open `http://localhost:3000` to view the app!

---
<div align="center">
  <em>“Small nudges today. A sustainable world tomorrow.”</em>
</div>
