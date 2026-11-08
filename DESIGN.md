---
name: HandyBet Design System
description: Premium Obsidian Glass & Neon Aura aesthetic for social iGaming
colors:
  primary: "oklch(0.657 0.229 29.729)"
  secondary: "oklch(0.872 0.274 143.533)"
  accent: "oklch(0.403 0.273 266.181)"
  background: "oklch(0.13 0.02 30.73)"
  card: "oklch(0.2 0.04 27.17)"
  border: "oklch(0.277 0.083 29.660)"
  muted: "oklch(0.17 0.02 25.92)"
  foreground: "oklch(0.991 0.002 23.598)"
  destructive: "oklch(0.611 0.244 13.521)"
typography:
  display:
    fontFamily: "Outfit, Inter, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "12px"
  lg: "20px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.md}"
    padding: "16px"
---

# Design System: HandyBet

## Overview

**Creative North Star: "The Obsidian Neon Room"**

HandyBet is a premium, high-energy P2P social betting platform. Its visual identity rejected the flat, dull corporate interfaces in favor of a sleek, dark cyber-casino lounge. It relies heavily on translucent glassmorphism layers, glowing accent lights, and clean technical typography. 

Key characteristics include:
- Deep obsidian and midnight blue backgrounds.
- High-contrast, vibrant neon indicators (Mint/Emerald, Indigo, Gold).
- Subtle, semi-transparent borders to simulate physical glass panes.
- Generous, ergonomic spacing designed for comfortable mobile and desktop navigation.

## Colors

The palette is built around deep obsidian tones highlighted by electric neon colors that define action and context.

### Primary
- **Primary / Active** (oklch(0.657 0.229 29.729)): Associated with money, bets, active status, success, and navigation highlights.

### Secondary
- **Secondary Action** (oklch(0.872 0.274 143.533)): Used for messaging, chat screens, social interaction elements, and secondary actions.

### Tertiary (Accent)
- **Accent Highlight** (oklch(0.403 0.273 266.181)): Highlights prizes, bonuses, lottery wins, and premium states.

### Neutral
- **Background** (oklch(0.13 0.02 30.73)): Main background color for all screens.
- **Card** (oklch(0.2 0.04 27.17)): Semi-translucent material for cards, forms, and sidebars.
- **Muted** (oklch(0.17 0.02 25.92)): Muted backgrounds and secondary surfaces.
- **Border** (oklch(0.277 0.083 29.660)): Subtle border to define structure.
- **Foreground** (oklch(0.991 0.002 23.598)): Main text color.

### Named Rules
**The Neon Rarity Rule.** Neon accents (primary/secondary/accent) should not cover more than 10% of any screen. Their vibrance is meant to draw attention, not flood the user's vision.
**The Matte Glass Rule.** Card backdrops must use an opacity between 70% and 90% combined with a heavy blur (`backdrop-filter`) to maintain legibility.

## Typography

**Display Font:** Outfit, Inter, sans-serif
**Body Font:** Inter, sans-serif

### Hierarchy
- **Display** (800, clamp(2rem, 5vw, 3.5rem), 1.1): Hero titles, dashboard figures, and wallet balances.
- **Headline** (700, 20px, 1.3): Page headers, group titles, and modal headers.
- **Title** (600, 16px, 1.4): Card headings, user names, and section titles.
- **Body** (400, 14px, 1.5): Comments, posts text, chat messages, and details.
- **Label** (700, 11px, 0.05em, uppercase): Buttons, input headers, badges, and metadata tags.

## Layout

HandyBet uses an 8px grid system. Spacing should be derived from the standard scales: `8px`, `12px`, `16px`, `24px`, `32px`.
On desktop, it utilizes a balanced 3-column layout (Left Sidebar 20%, Center 60%, Right Sidebar 20%) with a maximum width of `1600px`. On mobile, it collapses to a single-column layout with a bottom tab bar.

## Elevation & Depth

HandyBet does not use traditional drop shadows. Depth is conveyed entirely via **Glassmorphism layering** and border contrast. 
Higher elements (like Modals or Popovers) use a lighter glass color (oklch(0.2 0.04 27.17)) with a higher border opacity.

## Shapes

- **Forms and Inputs:** Rounded pill / full caps (9999px) for primary buttons and search inputs.
- **Cards and Containers:** Smooth squircle corners with a `12px` or `20px` radius.
- **Badges:** Completely rounded (9999px) capsules.

## Components

### Buttons
- **Shape:** Full capsule (9999px) for primary buttons.
- **Primary:** Background (oklch(0.657 0.229 29.729)), Text (oklch(0.991 0.002 23.598)). Highly active, scales slightly down on tap (`active:scale-[0.98]`).
- **Secondary:** Background (oklch(0.872 0.274 143.533)), Text (oklch(0.991 0.002 23.598)).

### Cards / Containers
- **Corner Style:** Rounded-md (12px) or rounded-lg (20px).
- **Background:** Semi-translucent `oklch(0.2 0.04 27.17)`.
- **Border:** `1px solid oklch(0.277 0.083 29.660)`.

## Do's and Don'ts

### Do:
- **Do** use `backdrop-blur-md` on all floating layout panels and headers.
- **Do** use `font-mono` or `font-bold` tracking-wider for numeric values, tickets, and codes.
- **Do** wrap icons in rounded-full backgrounds with 10% opacity of the icon color.

### Don't:
- **Don't** use solid gray borders (e.g. `#cccccc`). Use translucent white borders (`oklch(0.277 0.083 29.660)`).
- **Don't** use emojis as primary navigation tab icons. Replaced entirely by SVG icons.
