---
name: Warm Coast Recovery
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#56423e'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#89726d'
  outline-variant: '#ddc0ba'
  surface-tint: '#9f402d'
  primary: '#9f402d'
  on-primary: '#ffffff'
  primary-container: '#e2725b'
  on-primary-container: '#5a0d02'
  inverse-primary: '#ffb4a5'
  secondary: '#16677a'
  on-secondary: '#ffffff'
  secondary-container: '#a2e7fd'
  on-secondary-container: '#1b697c'
  tertiary: '#8d4f11'
  on-tertiary: '#ffffff'
  tertiary-container: '#cb8241'
  on-tertiary-container: '#462200'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a5'
  on-primary-fixed: '#3e0500'
  on-primary-fixed-variant: '#802918'
  secondary-fixed: '#b1ecff'
  secondary-fixed-dim: '#8cd1e6'
  on-secondary-fixed: '#001f27'
  on-secondary-fixed-variant: '#004e5e'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  headline-xl:
    fontFamily: Quicksand
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Quicksand
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Nunito Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  margin-mobile: 20px
  margin-desktop: 40px
  gutter: 16px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is centered on compassion, urgency, and community trust. It serves residents and travelers in Santa Marta, Colombia, who are seeking lost pets or reporting found ones. The emotional response must be a balance of calm reassurance and immediate clarity.

The style is **Soft Minimalist** with a **Tactile** edge. It utilizes generous whitespace to reduce cognitive load during high-stress situations. UI elements feature significant rounding and soft transitions to appear approachable and non-threatening. High contrast is prioritized to ensure the interface remains legible under the intense Caribbean sun of Santa Marta.

## Colors

The palette is inspired by the natural landscape of Santa Marta—the warmth of the sun-baked earth and the cooling presence of the sea.

*   **Primary (Terra-cotta):** Used for critical actions, branding, and "Lost" status indicators. It evokes compassion and urgency.
*   **Secondary (Ocean Teal):** Used for "Found" status indicators, secondary actions, and navigation elements. It provides a calming counter-balance to the primary orange.
*   **Neutral:** A range of soft grays (Warm Grays) are used for text and borders to keep the UI grounded and professional without feeling "cold" or "corporate."
*   **Semantic:** 
    *   Success: Teal (Secondary)
    *   Warning/Urgent: Terra-cotta (Primary)
    *   Background: Off-white (#FAFAFA) to reduce glare.

## Typography

This design system uses two highly legible, rounded sans-serifs. **Quicksand** provides a friendly, geometric character for headlines, while **Nunito Sans** ensures high readability for descriptions and data.

For outdoor use, body text should never drop below 16px to ensure accessibility for users in high-glare environments. Headlines use a tighter letter spacing to create a strong visual "anchor" for pet profiles.

## Layout & Spacing

The layout follows a **fluid-to-fixed grid** hybrid. 
*   **Mobile:** A 4-column grid with 20px outside margins. This is the primary target for on-the-go reporting.
*   **Desktop/Tablet:** A 12-column grid centered to a max width of 1200px.

Spacing is generous to prevent the UI from feeling cluttered during stressful moments. Use "Stack" spacing for vertical rhythm: `stack-sm` for related items (label + input), `stack-md` for component groups, and `stack-lg` for section breaks.

## Elevation & Depth

To maintain a soft and friendly aesthetic, the design system avoids harsh, dark shadows. 

*   **Low Elevation:** Used for cards and input fields. Defined by a soft, diffused shadow with a hint of the primary or secondary color tint (e.g., a 10% opacity Terra-cotta shadow).
*   **High Elevation:** Reserved for Floating Action Buttons (FAB) and Modals. These use a larger blur radius (24px+) to create a "floating" effect, making the most important actions feel physically closer to the user.
*   **Depth Tiers:** Background is neutral light, cards are pure white, and active states use a subtle inner-glow rather than an inset shadow to keep the UI "light."

## Shapes

The shape language is defined by extreme roundedness. This eliminates the "sharpness" associated with clinical or overly technical apps.

*   **Cards:** 16px to 24px corner radius.
*   **Buttons:** Fully pill-shaped (capsule) to maximize the friendly "tap-target" feel.
*   **Images:** All pet photos should feature a 16px radius to match the container logic.

## Components

### Buttons & CTAs
*   **Primary:** Pill-shaped, Terra-cotta background with White text. Bold 18px labels.
*   **Secondary:** Pill-shaped, Teal background or Teal outline for less urgent actions.
*   **FAB:** Large, circular Terra-cotta button with a "+" icon for "Report a Pet," located at the bottom right of the screen.

### Pet Cards
*   Full-width on mobile, 3-column on desktop.
*   Feature a prominent image with a "Status Badge" overlay in the top left corner.
*   Bottom section includes the Pet Name (Headline-md), Location (Caption with icon), and Time Elapsed.

### Status Badges
*   **Perdido (Lost):** Primary Terra-cotta background, white text, bold caps.
*   **Encontrado (Found):** Secondary Teal background, white text, bold caps.
*   Badges use a 32px height and are fully rounded.

### Map Integration
*   Custom map styling using a "Light" or "Sand" theme to match the brand.
*   Markers use the same color coding as Status Badges (Terra-cotta for lost, Teal for found).
*   Markers should pulsate if a report is less than 1 hour old.

### Input Fields
*   16px corner radius.
*   Thick 2px borders when focused in Primary Terra-cotta.
*   Labels are always visible (not floating) to ensure clarity during data entry.