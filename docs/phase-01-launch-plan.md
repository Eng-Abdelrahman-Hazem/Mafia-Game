# Original IP Mobile Crime Strategy Game — Phase 1 Launch Plan

## 0) Launch-Minded Roadmap (Idea → Published Android)

### Phase 1 — Product Definition & Scope Lock (Week 1)
**Objectives**
- Lock fantasy, core loop, MVP boundaries, and monetization guardrails.
- Prevent scope creep before engineering starts.

**Decisions needed from founder**
- Theme tone boundaries (how dark vs store-safe).
- PvP intensity (loss severity).
- Live-ops ambition for first 90 days.

**Recommended defaults**
- Stylized crime fiction, non-graphic violence, no real-world references.
- PvP with capped losses (anti-churn).
- Lean live-ops cadence: 2 weekly rotating events.

**Outputs/artifacts**
- Product vision one-pager.
- MVP feature contract (in/out list).
- Technical stack decision log.

**Risks/tradeoffs**
- Over-ambitious MVP delays launch.
- Underpowered social features hurt retention.

---

### Phase 2 — Preproduction Architecture & Tooling (Weeks 2–3)
**Objectives**
- Establish monorepo, CI/CD, coding standards, telemetry schema, content config pipeline.

**Decisions needed**
- Cloud provider.
- Auth providers for launch.
- Crash/analytics vendor.

**Recommended defaults**
- Docker + Postgres + Redis + NestJS API.
- Guest + device auth at launch; email link after tutorial.
- Firebase Crashlytics + self-owned gameplay telemetry tables.

**Outputs**
- Running backend skeleton with auth, profile, resources, missions.
- Unity bootstrap app with login/home loop.
- Admin shell with RBAC.

**Risks/tradeoffs**
- Too many third-party SDKs increase QA matrix.

---

### Phase 3 — Vertical Slice (Weeks 4–7)
**Objectives**
- End-to-end playable: onboarding → crimes → upgrade → PvE/PvP sample → reward claims.

**Decisions needed**
- Initial district count.
- Initial crew tiers.

**Recommended defaults**
- 4 districts in MVP.
- 3 crew tiers + 1 hero slot.

**Outputs**
- Functional combat resolution service.
- 20 tutorial quests.
- First daily loop + first event loop.

**Risks/tradeoffs**
- Combat complexity can bloat timeline.

---

### Phase 4 — MVP Production Build (Weeks 8–14)
**Objectives**
- Implement all MVP systems; complete admin tools and analytics instrumentation.

**Decisions needed**
- Soft-launch geos.
- Pricing anchors.

**Recommended defaults**
- Limited soft launch in 1–2 English-speaking regions.
- Starter pack + battle pass + monthly subscription.

**Outputs**
- Feature-complete Android build.
- Backend live-ops controls (event toggles, economy values).
- Data dashboards.

**Risks/tradeoffs**
- Content volume vs polish tension.

---

### Phase 5 — Soft Launch, Tuning & Compliance (Weeks 15–20)
**Objectives**
- Tune economy/retention/monetization, harden stability, complete legal/privacy and store assets.

**Decisions needed**
- D1/D7/D30 target thresholds to gate global launch.
- Hard reset policy (if any) before launch.

**Recommended defaults**
- KPI gates: D1 ≥ 35%, D7 ≥ 12%, payer conversion ≥ 1.5%.
- No full wipe after public soft launch.

**Outputs**
- Updated balance tables.
- Optimized FTUE.
- Store listing package and policy docs.

**Risks/tradeoffs**
- Aggressive monetization can suppress retention.

---

### Phase 6 — Global Android Release & Live Ops (Weeks 21+)
**Objectives**
- Ship globally, run weekly operations, monthly content drops, anti-fraud and support operations.

**Decisions needed**
- Team allocation post-launch (content vs tech debt).

**Recommended defaults**
- 60% live-ops content, 25% economy/feature tuning, 15% tech stability.

**Outputs**
- Global release build.
- 90-day live-ops calendar.

**Risks/tradeoffs**
- Missing live-ops cadence causes post-launch decay.

---

## 1) One-Page Product Vision

**Working Title:** **Shadow Districts** (placeholder codename)

**Fantasy:**
Player rises from street-level operator to city kingpin in a fictional neon-noir metropolis through strategy, social coordination, and long-term economic management.

**Pillars:**
1. **Power Through Planning** — choose crimes, crew composition, and upgrades; decisions matter.
2. **Social Leverage Wins** — syndicates, chat, coordinated raids, shared goals.
3. **Progress Every Session** — short active actions + long timers + offline gains.
4. **Fair Competitive Pressure** — PvP has risk, but protected against catastrophic loss.
5. **Live City, Always Moving** — rotating events and leaderboard races.

**Target Session Pattern:**
- 3–6 sessions/day, 4–12 minutes each.
- Longer evening social session for syndicate coordination.

**Audience:**
- Players who liked classic social crime progression games.
- Midcore strategy users who enjoy asynchronous PvP and status progression.

**MVP Promise:**
- Highly sticky progression core with social layer and ethically monetized acceleration.

**Launch Positioning:**
- “Build your criminal empire in a living city. Outsmart rivals. Rule districts with your syndicate.”

---

## 2) MVP Feature List (Ship vs Later)

### In MVP (must ship)
- Guest/device account + optional email binding.
- Tutorial + guided FTUE (20 steps).
- Player profile, name, avatar frame.
- City map with 4 districts.
- Safehouse with 6 upgradeable buildings.
- Jobs/Crimes (timer-based PvE missions).
- Crew recruitment (3 tiers).
- Simplified PvE combat simulation.
- Asynchronous PvP raid list + revenge.
- Hospital/Jail recovery timers.
- Syndicates: create/join, chat, donations, help timers.
- Leaderboards: power, district points, syndicate points.
- Daily quests, weekly objective track.
- Black Market shop.
- IAP: starter pack, gem bundles, battle pass-lite, monthly subscription.
- Push notification hooks.
- Admin panel: player lookup, grants, bans/mutes, event config, economy values.
- Telemetry and KPI dashboard.

### Post-launch (defer)
- Real-time battles.
- Advanced territory wars.
- Hero collection gacha complexity.
- Deep crafting economy.
- Cross-server wars.

---

## 3) Recommended Technical Stack (with Justification)

- **Client:** Unity (URP, mobile UI focus)
  - Fast iteration for small teams, mature Android pipeline, later iOS reuse.
- **Backend API:** NestJS (Node.js, TypeScript)
  - Strong modular architecture, validation, testability, team velocity.
- **DB:** PostgreSQL
  - Reliable relational integrity for economy and transactional systems.
- **Cache/queues:** Redis + BullMQ
  - Timers, delayed jobs, event rollovers, anti-spam throttling.
- **Realtime/social:** WebSocket Gateway (NestJS) for chat/presence.
- **Admin:** Next.js + TypeScript + component library.
- **Analytics:**
  - Gameplay events to warehouse tables (Postgres initially).
  - Crashlytics for crash reporting.
- **Infra:** Docker Compose (dev), Terraform-ready cloud deployment (staging/prod).
- **Auth:** Device ID + guest token; optional email magic link binding.

**Why not switch stacks now?**
Your proposed stack is already launch-optimal for a lean team. Switching to heavier ecosystems (e.g., microservices on day one) would delay shipping.

---

## 4) First-Pass Core Game Loop

1. **Login + collect idle income** (cash/influence/contraband drip).
2. **Claim daily rewards + quests**.
3. **Spend energy on crimes/PvE jobs**.
4. **Use rewards to recruit crew and upgrade safehouse buildings**.
5. **Scout and run limited PvP raids** for bonus loot/rank points.
6. **Heal/recover timers**; use syndicate help or premium currency to accelerate.
7. **Contribute to syndicate objective/event**.
8. **Visit black market/shop** for strategic purchases.
9. **Set defense/loadout and queue long upgrades** before logout.
10. **Receive push reminders** when timers complete/event windows open.

---

## 5) Original Setting, Factions, and Resource Model

### Setting: **Greyhaven City**
A fictional coastal megacity split among powerful underworld blocs and corrupt corporate zones. Stylized neo-noir tone, no direct references to real locations.

### Launch Faction Backgrounds (choice at start; mostly flavor + small perk)
1. **Dock Serpents** — logistics smugglers (small contraband yield bonus).
2. **Velvet Circuit** — high-tech hustlers (small research speed bonus).
3. **Iron Vow** — street enforcers (small crew training speed bonus).

### Resource Model (MVP)
- **Cash (soft currency):** core upgrades, recruitment.
- **Gems (premium):** speedups, premium offers, battle pass purchase.
- **Energy:** action gate for crimes.
- **Influence:** unlocks district operations and progression gates.
- **Contraband:** higher-tier upgrades and black market recipes.
- **Loyalty:** crew morale modifier; prevents brute-force spam progress.
- **Heat:** anti-grind pressure variable; high heat reduces rewards and raises risk.

**Snowball controls:**
- PvP steal caps per day.
- Protection shield after repeated defenses.
- Diminishing returns on farming same target type.

---

## 6) Monetization Outline (Ethical + Commercial)

### MVP Monetization Products
- **Starter Pack (one-time):** best value early conversion.
- **Gem Bundles:** baseline monetization.
- **Monthly Subscription:** daily gems + QoL (extra queue slot).
- **Battle Pass Lite (28-day):** mission-based premium track.
- **Limited-time offers:** event-aligned, capped frequency.

### Guardrails
- No paywall on core mode access.
- Paid acceleration capped to preserve competitive integrity.
- Matchmaking bands to reduce whale predation.
- Clear odds/disclosure if any random reward system is used.

---

## 7) Top Risks + Mitigation

1. **Scope creep**
   - Mitigation: strict MVP in/out list, feature freeze at Week 10.
2. **Economy inflation**
   - Mitigation: daily faucet/sink dashboards, hotfixable config tables.
3. **PvP frustration/churn**
   - Mitigation: loss caps, protection shield, revenge rewards.
4. **Content starvation post-launch**
   - Mitigation: reusable event templates + param-driven content.
5. **Cheat/abuse**
   - Mitigation: server-authoritative rewards, anomaly detection, rate limits.
6. **Low-end Android performance**
   - Mitigation: strict draw-call/memory budgets, test matrix early.
7. **Compliance delays**
   - Mitigation: privacy/legal checklist starts in Phase 2, not at end.

---

## 8) Suggested Repo / Project Structure

```text
mafia-original-game/
  clients/
    unity-client/
      Assets/
      Packages/
      ProjectSettings/
      docs/
  services/
    game-api/                 # NestJS API (auth, profile, missions, pvp)
    realtime-gateway/         # WebSocket chat/presence (can start inside game-api)
    worker/                   # BullMQ jobs: timers, resets, leaderboard rollups
    admin-web/                # Next.js admin panel
  packages/
    shared-contracts/         # DTOs, enums, API contracts
    game-config/              # JSON/TS balance configs
    analytics-schema/         # event names + validation contracts
    tooling/                  # scripts for seed/import/export/local tasks
  infra/
    docker/
      docker-compose.yml
    terraform/
      modules/
      envs/
        dev/
        staging/
        prod/
  docs/
    product/
    design/
    tech/
    economy/
    liveops/
    release/
  .github/
    workflows/
```

**MVP simplification tip:**
Start with `game-api` containing REST + WebSocket modules; split into separate services only when scale requires.

---

## 9) Founder Decision Lock (Applied)

These decisions supersede default recommendations and are now the build contract for Phase 2.

1. **PvP loss policy:** **A (Low-loss)**  
   - Implement hard caps on raid steal values, fast shield recovery, and revenge bonuses to reduce churn from repeated losses.

2. **Soft launch monetization posture:** **A (Conservative pricing)**  
   - Optimize for retention quality and payer trust first; delay aggressive pricing tests until after D7 stabilization.

3. **Live-ops scope for first 90 days:** **B (Heavy cadence)**  
   - Run multiple concurrent event tracks from launch month, but execute them through templates to avoid content-team overload.

4. **Auth at launch:** **A (Guest/device first + optional email bind)**  
   - Preserve fast onboarding while supporting account recovery with encouraged email binding after tutorial completion.

5. **Post-MVP team allocation:** **A (60% live-ops / 25% tuning / 15% tech stability)**  
   - Maintain predictable live cadence while reserving explicit capacity for economy tuning and reliability.

### Implementation Impact for Phase 2 (Updated)

- **Backend priority changes**
  - Add event-template system early (event definitions, schedule windows, reward tables, leaderboard links).
  - Build low-loss PvP rules as configurable policy tables (steal caps, shield timers, revenge multipliers).
  - Add dynamic pricing config for conservative monetization experiments (server-side offer parameters).

- **Client priority changes**
  - Build reusable event UI shell first (tabs/cards/progress/reward claim patterns) to support heavy cadence.
  - Add clear PvP protection state indicators (shield active, recent-loss protection, revenge eligibility).
  - Implement post-tutorial email binding nudge flow without hard gating gameplay.

- **Admin/live-ops priority changes**
  - Event authoring panel becomes MVP-critical (clone event templates, schedule overlap checks, reward sanity warnings).
  - Pricing controls require activation windows and audience segmentation switches.

### Phase 2 Exit Criteria (Locked)

- Event template pipeline supports at least **4 simultaneous event types** with config-only variation.
- PvP protection system verified with automated rule tests for edge cases (repeat attacker, multi-defense chain).
- Offer/pricing configs deploy without client patch.
- Guest-to-email account binding flow completed and tracked in analytics funnel.
