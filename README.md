# Expense — a Paper × Claude Code example

A small expense-tracking app built to learn a design-to-code loop: screens are
designed on a [Paper](https://paper.design) canvas, then built as a working React
app by [Claude Code](https://claude.com/claude-code), with both sides kept in step.

The headline flow: **snap a receipt, let the app fill in the expense, fix anything
it got wrong, save, and see it in your latest expenses.**

> **Sample data only.** There is no real camera or receipt reader yet. Every scan
> "reads" the same sample receipt (Luna Ramen, $52.09) so the whole flow can be
> clicked through end to end.

## Run it

```bash
npm install
npm run dev        # then open http://localhost:5173
```

Vite is pinned to v6 because this project was set up on Node 20.18; Vite 8 (and
the `oxlint` checker that came with the template) need Node 20.19 or newer.

---

## The flow and the thinking behind it

Receipt capture is a common pattern (expense tools, banking apps with check
deposit), and the good versions share a few ideas. Each screen here applies one:

| # | Screen | What it does | Why |
|---|--------|--------------|-----|
| 1 | **Expenses (home)** | Month total, latest expenses, a big **Scan receipt** button and a small **+** for typing one in. | Scanning is the fast path, so it gets the primary button; manual entry stays one tap away. |
| 2 | **Camera** | Dark viewfinder, yellow corner brackets lock onto the receipt, "Receipt found — hold steady", then it snaps on its own. Upload from photos is always available. | Guide the photo instead of hoping it's usable. Auto-capture removes the "did I hold still?" moment. |
| 3 | **Check photo** | Straightened receipt, "Sharp · all 4 corners in view", **Retake** / **Use photo**. | Catch a blurry photo *before* waiting on it to be read. |
| 4 | **Reading receipt** | Named steps tick off (uploaded → found merchant → reading total and tip → suggesting category) while a scan line sweeps the receipt. "Enter it myself instead" is always there. | Specific progress makes a wait feel short and trustworthy; nobody should be stuck waiting. |
| 5 | **Review expense** | Everything pre-filled and labelled **Read from receipt**, with a receipt thumbnail. The category is marked *Suggested*. The handwritten tip gets a highlighted **Check** row: "Handwritten, so we might have misread it." | Automation should show its work. Flag the *one* field that's uncertain rather than asking the user to re-check everything, and say why in plain words. |
| 6 | **Edit sheet** | Tap any detail to change it. For the tip, the sheet shows a close-up of what was written on the receipt, the amount, and 18 / 20 / 22% presets — and tells you "$8.10 matches a 20% tip". | Fixing a mistake should take seconds, with the source right there to compare against. |
| 7 | **Saved** | Back on home: "Expense saved" with **Undo**, the new expense highlighted in place, the month total updated. | Confirm in context, and make the action reversible instead of asking "are you sure?". |

### Visual system

- **Mood: signage** — the look of transit and wayfinding signs: black type on one
  sharp yellow, used deliberately.
- **Yellow means money.** The big amount block on every screen is yellow; so are
  the camera's detection brackets and the "needs a look" highlight.
- **Tokens** live in [`src/theme.css`](src/theme.css): `#FFD000` accent,
  `#111111` ink, `#6B6B6B` muted text, `#E8E8E8` rules, `#FFF4C2` flag, and
  Inter Tight for all UI type.
- The sample receipt is a photo generated with Paper's image tool (tutorial step B).
  The app shows the whole photo in the camera, crops the receipt out of it for
  the check and review screens, and crops just the handwritten tip line for the
  tip sheet, so you compare against the actual pen marks.

---

## How the work moved between Paper and Claude Code

Paper is a design canvas that builds layouts with real CSS (flexbox), and it
exposes that canvas to AI agents through an MCP server. Claude Code connects to
it with Paper's `paper-desktop` plugin, so the same agent can read and write the
design *and* the code.

```
 Paper canvas  ── design ──▶  review screenshots  ── read exact values ──▶  React code
      ▲                                                                        │
      └──────────────── changes discussed in chat, applied to either side ◀─────┘
```

What that looked like in practice:

1. **Brief first.** Before drawing anything, the agent posts a short design brief
   (mood, palette, type scale, direction) so the choices are visible and easy to
   push back on.
2. **Design on the canvas, piece by piece.** Each screen is built one group at a
   time (status bar, header, amount, each row, buttons) so you can watch it come
   together in Paper. Repeated pieces are cloned, not rewritten.
3. **Screenshot and critique.** After each section the agent screenshots the
   artboard and checks spacing, type, contrast and alignment, then fixes what's
   off (for example: clipped avatar initials, detection brackets drifting off the
   receipt).
4. **Code from exact values, not pictures.** To build a screen, the agent pulls the
   artboard's JSX and computed styles from Paper and translates them into this
   project's conventions: named CSS variables, components, and real behavior.
5. **Test the real thing.** The running app is clicked through in a browser and
   compared against the Paper screenshots. Bugs found this way (dark screens
   rendering white, a tip label mis-styled, "a 18% tip") were fixed in code.
6. **Commit and push** once a slice works end to end.

### Where the two sides stand today

| Screens | Paper | Code |
|---------|:-----:|:----:|
| Expense detail, Add expense (manual) | ✅ | ✅ |
| 1–5: Home → Camera → Check photo → Reading → Review | ✅ | ✅ |
| 6–7: Edit sheet, Saved state | ✅ | ✅ |

Screens 6 and 7 went the other direction: Paper's free plan caps agent activity
per week and the limit was reached mid-flow, so they were designed straight into
code first, then drawn back onto the canvas after upgrading to Paper Pro. The
receipt photo made the same round trip: generated in Paper, pulled into the code,
then placed into every flow board.

### Things we learned

- Paper's free tier has a **weekly MCP limit**; big flows can hit it. Plan the
  canvas work, or finish in code and sync back later. Reading from the canvas
  (like pulling the receipt photo out of Paper) still worked after the limit
  blocked drawing.
- Some CSS that works in browsers didn't apply on Paper nodes during this build
  (`transform: scale()` on a cloned element, negative margins for overlapping
  avatars, `position: absolute` on a copied image layer, `right`/`bottom`
  offsets). Simple flex layouts were the reliable path, and crops worked best as
  a frame's own background image with a set size and offset, the same technique
  the code uses.
- In code, shared styles must load **before** screen styles
  ([`src/main.jsx`](src/main.jsx)), or they quietly override screen-specific rules.

---

## v2: redesigned with patterns from Mobbin

> **Designed, not built yet.** Everything above describes the working app (v1).
> This section is the next version, designed in Paper and exported to
> [`docs/design/`](docs/design/).

![v2 overview: Snap the pile. Fix only what's unsure.](docs/design/v2/0-overview.png)

v1 handles one receipt at a time and makes you wait while it's read. To see how
the best finance apps handle this, the agent searched [Mobbin](https://mobbin.com)
(a library of real app screens) through its MCP server, compared how Expensify,
Mercury, Brex, GoPay, Starling, YNAB, Splitwise, Wise, Monzo, Monarch and Revolut
handle adding, reviewing and tracking expenses, and pulled out seven principles.

### The seven principles

| # | Principle | Seen in | v1 |
|---|-----------|---------|----|
| P1 | **Never make people wait for the scan.** Receipts drop into the list while they're read; snap several in a row. | [Expensify](https://mobbin.com/flows/49a113d4-5959-4b6e-ae99-a4a0a0e917c3), Splitwise | ❌ Full-screen wait |
| P2 | **Turn problems into a to-do list.** Missing receipts and unsure fields become tasks with one action each. | [Mercury](https://mobbin.com/screens/642b40bf-1b52-4834-aee9-eacaff4ef63c), Expensify | ⚠️ "2 missing receipts" you can't act on |
| P3 | **Show what was checked, field by field.** Confirm merchant, date and amount; flag only what's unsure. | [Brex](https://mobbin.com/screens/33be87cd-7c32-4964-9fd0-0bd5c0d76f3a) | ⚠️ Tip flagged, others not confirmed |
| P4 | **Categorize in one tap.** Top categories as big tiles, the rest under More; remember each merchant. | [GoPay](https://mobbin.com/flows/a36b2e5c-e98d-46d5-8900-90d272ad9e1a), Starling | ⚠️ Text chips, no memory |
| P5 | **Keep extras optional.** Note, split, itemize and repeat sit below the main fields. | [YNAB](https://mobbin.com/flows/0a544fb8-9f90-41b7-92c7-307af43e3e99), [Splitwise](https://mobbin.com/screens/9a5af576-4e42-476a-b512-75855c6baef9), GoPay | ❌ Missing |
| P6 | **Show where the money goes.** Month switcher, category bars with %, compared with past months. | [Wise](https://mobbin.com/screens/b2d58d78-50f9-45bc-98ba-daa46314b5c2), [YNAB](https://mobbin.com/screens/8d4d0215-caa1-4c47-81df-81e7f3b7639c), Starling | ❌ Just a month total |
| P7 | **Make the list searchable.** Grouped by day with daily totals, search and filter chips. | [Monzo](https://mobbin.com/screens/2c2b2c81-2083-425b-aea7-aa3ea8bd861f), Monarch, Wise | ❌ Flat list of 5 |

**Kept from v1**, because it already matched these patterns: guided auto-capture
with corner brackets, flagging the one uncertain field with a crop of the real
handwriting, and Undo instead of "are you sure?".

### The v2 flow, screen by screen

Each board shows the finished screen with **yellow lettered callouts** on what
changed, and notes beside it: what it was, what it is now, and which principle
and app it comes from.

**Home → Capture → Review (1 of N) → Check the tip** is the main path.
**Needs attention** and **Insights** open from Home.

#### 1. Home
From a total and the latest 5 to a place that tells you what to do next: a
category split, a black **Needs attention** card, search and filters, the list
grouped by day, and receipts still being read shown as a row. (P2, P6, P7, P1)

![v2 Home](docs/design/v2/1-home.png)

#### 2. Capture
Scan, Upload and Manual become tabs on one screen. Snap a stack in a row; a tray
fills up while each receipt is read in the background, and only a blurry shot
gets flagged. This replaces v1's separate Check photo and Reading screens. (P1)

![v2 Capture](docs/design/v2/2-capture.png)

#### 3. Review
Confirm, don't retype: checked-field chips (✓ Merchant ✓ Date ✓ Bill ? Tip), the
tip flag with its reason up front, one-tap category tiles picked from your last
visit, optional extras, and **Save · next receipt** to move through the batch.
(P3, P4, P5, P1)

![v2 Review](docs/design/v2/3-review.png)

#### 4. Check the tip
Mostly kept from v1: the real handwriting, tip presets, and "matches a 20% tip".
One change: confirming here also clears it from Needs attention. (P3, P2)

![v2 Check the tip](docs/design/v2/4-check-the-tip.png)

#### 5. Needs attention (new)
Every loose end is a task you can finish right here: a progress bar toward
"ready to export", match a pile of receipts at once, **Snap it / Upload / No
receipt** on each card, and confirm the tip in one tap. (P2, P1, P3)

![v2 Needs attention](docs/design/v2/5-needs-attention.png)

#### 6. Insights (new)
Week, Month, Year; this month against the last five; tappable category bars;
the biggest expense; and **Export** (CSV + receipts). The earlier months' bars
are example data, since the sample only covers September. (P6, P7)

![v2 Insights](docs/design/v2/6-insights.png)

### How v2 was made

1. **Research on Mobbin.** Searched real apps for scanning receipts, adding
   expenses by hand, spending breakdowns, searchable lists and "needs a receipt"
   to-dos, then compared the patterns.
2. **Principles.** Boiled the patterns down to P1–P7, and checked each against v1.
3. **Grey-box wireframes.** Low-fidelity layouts in Paper to try the ideas before
   styling them (below).
4. **Finished design with callouts.** The same yellow-and-black system as v1,
   the real receipt photo, and a note for every change.

<details>
<summary><b>Wireframes</b> (step 3)</summary>

![Principles board](docs/design/wireframes/0-principles.png)

| | |
|---|---|
| ![W1 Home](docs/design/wireframes/w1-home.png) | ![W2 Capture](docs/design/wireframes/w2-capture.png) |
| ![W3 Review](docs/design/wireframes/w3-review.png) | ![W4 Needs attention](docs/design/wireframes/w4-needs-attention.png) |
| ![W5 Insights](docs/design/wireframes/w5-insights.png) | |

</details>

**Would need more than front-end work:** matching a pile of receipts to their
expenses and reading receipts in the background both need a real
receipt-reading service.

---

## The agent and its tools

This project was built by **a single Claude Code agent** working in the terminal.
It didn't hand work off to other agents; instead it reached each system through
a tool connection:

| Tool | Connected via | Used for |
|------|---------------|----------|
| **Paper** | Paper MCP server (`paper-desktop` plugin) | Reading the canvas, drawing artboards, screenshots, pulling JSX and exact styles, exporting the design images |
| **Mobbin** | Mobbin MCP server | Searching real app screens and flows for the v2 research |
| **Browser** | Playwright MCP server | Opening the running app, clicking through the flow, screenshots for comparison |
| **Files & terminal** | Claude Code built-ins | Writing the React code, running `npm`, building |
| **git + GitHub** | `git` and the GitHub CLI (`gh`) | Commits, creating this repo, pushing |

The person in the loop sets direction and makes the calls: what flow to explore,
what to keep, when to commit, and whether the repo is public. Claude Code can
also run separate sub-agents in parallel (for example one researching patterns
while another builds); that would be a natural next step for larger flows, but
it wasn't needed here.

---

## Project structure

```
src/
  main.jsx            entry point; loads global + shared styles first
  App.jsx             screen-to-screen flow and saved expenses (localStorage)
  theme.css           design tokens and shared pieces (rows, buttons, chips)
  data.js             sample expenses, the sample receipt, formatting helpers
  Home.jsx            1 + 7: expenses home, saved toast with undo
  scan/Camera.jsx     2 + 3: camera with auto-capture, check photo
  scan/Reading.jsx    4: reading progress
  scan/Review.jsx     5: review with flagged tip
  scan/EditSheet.jsx  6: bottom sheet for editing any field
  ReceiptPhoto.jsx    the sample receipt photo: full camera view and crops
  assets/             receipt-luna-ramen.jpg, generated in Paper
  AddExpense.jsx      manual entry with number keypad
  ExpenseDetail.jsx   a single saved expense

docs/design/
  v2/                 the six v2 boards + overview, exported from Paper
  wireframes/         principles board + grey-box wireframes W1–W5
```

## Not built yet

- The v2 design above: it exists in Paper and as images, not in code
- Real camera access and a real receipt-reading service
- Flash, payment method and "Edit expense" on the detail screen are placeholders
- Accounts and syncing: expenses are stored only in this browser
