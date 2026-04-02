# 🏛️ Agrotek Elite: Operational Contribution Standards

As an institutional contributor to the Agrotek Elite project, you are expected to maintain the highest standards of code and branding integrity.

## 💼 Institutional Terminology

All UI labels, placeholders, and logic must adhere to the high-yield agricultural branding. Avoid colloquialisms or informal technical jargon.

| 🚜 Informal | 🏛️ Institutional |
| :--- | :--- |
| **Complete** | `FULFILLED` |
| **Cancelled** | `VOIDED` |
| **User** | `STAKEHOLDER` |
| **Buy** | `AUTHORIZE PURCHASE` |
| **Orders** | `PROCUREMENT LOGS` |
| **Staff** | `ADMINISTRATIVE CORPS` |

## 🧪 Functional Verification Protocol

Before submitting any PR to the strategic registry, you **MUST** ensure the 12-test Playwright suite passes with a 100% success rate. The suite covers:

1.  **Identity Hub (Auth)**: Enlistment and session resilience.
2.  **Marketplace (Farmer)**: Real-time procurement and dossier flows.
3.  **Command Center (Admin Core)**: Logistics, data ingestion, and registry management.
4.  **Treasury (Admin Finance)**: Settlement logic and POS dispatching.

### Running Audit
```bash
node Backend/seeder.js
npx playwright test --workers=1
```

## 📐 Styling Manifest

- Use **Vanilla CSS** or **Styled Components** with a premium, high-contrast palette.
- Prioritize **Institutional Dark** and **Agro-Emerald** accents.
- All interactive elements must be clearly labelled in **uppercase institutional caps** for critical actions.

---

*Thank you for contributing to the strategic advancement of Pakistani agriculture.*
