# Palettes

The site does not use CSS variables, so palette changes live in
`public/style.css`. This file keeps the previous palettes so they can be
restored later.

The background image is independent of the palette. The current body uses
`images/trees.gif` with a dark purple wash.

## Sunset / Vice City (current, restored 2026-11-18)

| Role | Color |
| --- | --- |
| Body text | `#FFC46B` |
| Headings | `#F76C91` |
| Links | `#A77BC8` |
| Visited links | `#FF9562` |
| Link hover | `#F76C91` |
| Borders | `#514B87` |
| Subtle borders | `#3A3563` |
| Muted text / bevels | `#A77BC8` |
| Construction text/border | `#FF9562` |
| Construction stripes | `#2E1A12` / `#3E2418` |
| Background fallback | `black` |
| Background wash | `rgba(0, 0, 0, 0.3)` neutral darkening |
| Scanlines | `rgba(247, 108, 145, 0.06)` / `rgba(167, 123, 200, 0.03)` / `rgba(81, 75, 135, 0.06)` |
| Hit counter | black / `#A77BC8` / `#FFC46B` |
| Slants | `#A77BC8` with `#F76C91` accents |

## Twin Peaks: The Forest (archived 2026-11-18)

Cream-colored panels, dark green typography, cherry-red buttons and vintage
borders.

| Role | Color |
| --- | --- |
| Black Forest | `#101C16` |
| Pine | `#1E3829` |
| Moss | `#426447` |
| Fern | `#78916B` |
| Cherry | `#792B39` |
| Velvet Red | `#A7434B` |
| Caramel | `#C28B54` |
| Mustard | `#DDBD88` |
| Ivory | `#F3EBDD` |
| Vintage Cream | `#E3D4B9` |
| Taupe | `#9C8874` |
| Coffee | `#493A32` |

Role mapping: Pine body text, Moss headings, Cherry links and buttons,
Velvet visited links, Coffee/Taupe borders, Ivory panels, Vintage Cream
secondary panels, Fern rain/online/slants, Mustard sparkles and counter
digits. Background fallback `#101C16`, wash `rgba(16, 28, 22, 0.72)`.

### Restoring The Forest

1. Set body text to `#1E3829`, remove the body text-shadow, and set the
   background fallback to `#101C16`.
2. Set the wash to `rgba(16, 28, 22, 0.72)`.
3. Set headings to `#426447`, links to `#792B39`, visited to `#A7434B`
   and hover to `#493A32`.
4. Restore cream panels: `.wrapper` and `.page-box` to `#F3EBDD`,
   `.retro-form` to `#E3D4B9`.
5. Set borders to `#493A32` / `#9C8874` and buttons to `#792B39` with
   `#DDBD88` bevels.
6. Restore the construction banner to Cherry/Velvet stripes with Ivory text.

## Twin Peaks — Double R Diner (archived 2026-11-18)

| Role | Color |
| --- | --- |
| Coffee | `#6B4635` |
| Cherry red | `#A83246` |
| Cream | `#F5EDE0` |
| Mustard | `#D6AD78` |
| Body text | Cream `#F5EDE0` |
| Headings | Cherry `#A83246` with cream glow |
| Links | Mustard `#D6AD78` |
| Visited links | Cherry `#A83246` |
| Borders | Coffee `#6B4635` |
| Subtle borders | `#2A1A12` |
| Background fallback | `#1A0F0A` |
| Background wash | `rgba(43, 24, 15, 0.55)` |
| Construction | cherry/coffee stripes, cream text |

### Restoring Double R Diner

1. Set body text to `#F5EDE0` and the background fallback to `#1A0F0A`.
2. Set the wash to `rgba(43, 24, 15, 0.55)`.
3. Set headings to `#A83246` with
   `text-shadow: 0 0 5px #F5EDE0, 2px 2px 0 #2A1A12`.
4. Set links to `#D6AD78`, visited to `#A83246`, hover to `#F5EDE0`.
5. Set borders to `#6B4635` and subtle borders to `#2A1A12`.
