# Claims Dashboard

> Inspired by the manual, outdated claims workflows found in large retail operations like Walmart, this project is a browser-based dashboard that lets users view, manage, and track item claims — all in one place.

---

## Project Overview

Claims Dashboard is a web-based application for managing damaged and missing item claims. It is designed to make claim tracking easier for warehouse associates and managers by consolidating everything into a single, easy-to-use interface.

**Client Story:** Consider Rahul, a receiving manager at a large supermarket. He deals with damaged and missing items daily while also managing truck receiving and manual claim filing. The process is slow, error-prone, and causes him to miss claims that could be credited back to the store. Missing items on shelves also lead to lost sales. Claims Dashboard solves this by giving Rahul a fast way to log, filter, and review all claims in one place.

---

## Problem Statement

Many retail stores still handle claims manually — filing paper forms and faxing them to suppliers or distribution centers. This applies not just to missing items, but also to damaged goods and possible theft. The result is delays, missed claims, inaccurate inventory, and lost sales.

This project addresses that gap with a real, operational tool that improves accuracy, saves time, and makes the daily experience better for both managers and associates.

---

## Technical Architecture

Built with **HTML**, **CSS**, and **JavaScript** using object-oriented design principles. Animations are handled by **GSAP**.

### Classes

| Class | Responsibility |
|---|---|
| `Claim` | Stores claim details: ID, type, amount, date, quantity, image, and status. Has methods for updating status and handling images. |
| `ClaimManager` | Manages all claims and connects the data layer to the UI. Key methods: `addClaim`, `createClaim` (generates IDs), `searchClaims` (filtering), and `getSummary` (metrics). |
| `DashboardUI` | Handles everything the user sees — renders the dashboard, controls the DOM, and binds user events. |

---

## Features

### Dashboard Cards
Displays all claims as interactive cards. Clicking a card expands the full details including claim type, amount, quantity, and current status.

### Filter & Search
Users can search claims by keyword or filter by status and claim type. Powered by `ClaimManager`'s search and filter logic.

### Add New Claim Form
A form that lets users log a new claim with an optional image upload. Submitting a claim updates the header metrics and total dollar amount in real time.

### AI Insights
Generates a plain-language summary of the current claim data using the OpenAI API. Includes stats like pending claim count and approval rate. A built-in fallback generates a basic summary if the API key is unavailable, so the dashboard always works.

---

## API Documentation

- **Provider:** OpenAI
- **Model:** `gpt-4o-mini` (low cost, sufficient for short summaries)
- **Endpoint:** `https://api.openai.com/v1/chat/completions`
- **Behavior:** Sends current claim data and requests a 2-3 sentence practical summary in plain prose (no bullet points). The response is displayed in the Insights panel.
- **Fallback:** If the API key is missing or the request fails, a pre-generated summary is shown instead.

---

## Challenges & Future Improvements

One of the main challenges was building a UI that felt clean and professional. Significant research and iteration went into the layout and animation timing using GSAP.

Given more time, the following features would be added:

- **Login system** — Separate roles for managers and associates, with managers able to edit claim amounts and adjust statuses.
- **Trend analysis** — A view that monitors claim trends over time and surfaces patterns (e.g., recurring missing items or high-theft periods).
- **Backend database** — Persistent storage so claims are saved across sessions and multiple users can contribute data.

---

## How to Run

1. Clone or download the project from [GitHub](https://github.com/krisono/Claims-Dash)
2. Open the project folder in VS Code
3. *(Optional)* Add your OpenAI API key to `config.js`
4. Open `index.html` with the **Live Server** extension
