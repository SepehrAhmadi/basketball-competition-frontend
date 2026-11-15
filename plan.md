# Plan: League Competition Page (Public App)

Target: `app/pages/competitions/[slug].vue` (Nuxt 4, public app, mobile-first).

This plan is for an AI implementer. Follow it exactly. Where the plan says "read X first", open that file and copy its patterns, do not invent new ones.

---

## 0. Scope and decisions (locked)

| Topic | Decision |
|---|---|
| Page | `app/pages/competitions/[slug].vue` (existing) |
| Existing league info card | Keep unchanged in position (top of page). |
| Groups section | Horizontal slider, one slide per group. Hidden completely when there are no groups. No title, no message. |
| Games section | Filter button + list of ALL games. Hidden completely when there are no games. |
| Games default filter | Upcoming games: `dateFrom` = today (Tehran, Jalali). |
| Pending result | All games are shown. "Pending result" is only one filter switch, not a default restriction. |
| Standings | NOT built. Stat columns show `—`. Stage 4 comes later. |
| Brackets | NOT built. Nothing is rendered for them now. |
| Data source | Both groups and games come from public endpoints: `GET /leagues/:leagueId/groups`, `GET /leagues/:leagueId/games`. |
| Team filter in drawer | Options from `GET /leagues/:leagueId/teams` (public). |
| Components | Two new components only: `ViewCompetitionLeagueGroupSlider` and `ViewCompetitionLeagueGameList` (which owns the filter drawer). No new composables. No new stores. |
| Layout | Mobile-first. Tailwind only, no inline styles. |

Admin-only fields must never be requested or rendered: `resultNote`, `cancelReason`, any `*Lock`, `issues`, `summary`, `can`.

---

## 1. Files to create or change

| # | Path | Action |
|---|---|---|
| 1 | `app/store/competition/state.ts` | Create (if missing) or extend |
| 2 | `app/store/competition/actions.ts` | Create or extend |
| 3 | `app/store/competition/index.ts` | Create (mirror `app/store/league/index.ts`) |
| 4 | `app/components/view/competition/league/GroupSlider.vue` | Create |
| 5 | `app/components/view/competition/league/GameList.vue` | Create (contains the filter drawer and the game cards inline) |
| 6 | `app/pages/competitions/[slug].vue` | Change: add the two components below the info card |

Do NOT create: composables, utils, separate `GameCard.vue`, `GameFilterDrawer.vue`, `GroupTable.vue`, or any file under `components/ui/`. The game card and the group table live inside the two components as template markup. If a helper function is needed, put it in the `<script setup>` of the component that uses it.

Read these files before writing code and copy their conventions:

- `app/store/league/index.ts`, `state.ts`, `actions.ts` (store structure, `useApi`, `handlerStore`, `latestRequest` pattern if present).
- `app/components/view/competition/LeagueSlider.vue` (Swiper usage, slide loading, skeleton, empty state, `watch` on filters, `onSwiper` / `slideTo` / `update`).
- `app/components/view/competition/FilterDrawer.vue` (Drawer, Select, Input, CustomLabel, apply and clear buttons, `draft` pattern, Jalali-independent filter values, `normalizeId`).
- `app/components/view/competition/LeagueCard.vue` (card markup, status chip classes, `cn` usage).
- `app/pages/competitions/[slug].vue` (current page, status label maps, info items).
- `app/components/icon/*.vue` (available icons: `cup`, `search`, `filter`, `date`, `date-number`, `check`, `trash`, `edit`, `plus`, `arrow-left`, etc.). Use existing icons only.
- `app/components/ui/` (existing primitives: Card, CardContent, Button, Input, Select, Skeleton, Drawer, Table if present). Use them. Do not hand-write primitives that exist.

If a pattern in this plan conflicts with an existing file, the existing file wins. Tell the user about the conflict in your summary.

---

## 2. Backend contract (read-only, do not change backend)

### 2.1 Groups

`GET /leagues/:leagueId/groups` (public, optional Bearer)

Response `data`:

```json
{
  "format": "GROUPS_KNOCKOUT" | "SINGLE_GROUP_KNOCKOUT" | null,
  "groups": [
    {
      "id": 3,
      "name": "گروه الف",
      "qualifiers": 2 | null,
      "teams": [
        {
          "leagueTeamId": 11,
          "team": { "id": 5, "name": "عقاب", "logoUrl": null },
          "organization": { "id": 2, "name": "باشگاه عقاب" } | null,
          "teamStatus": "ACTIVE" | "INACTIVE" | "DELETED"   // only in FINISHED leagues
        }
      ]
    }
  ]
}
```

Rules:
- `groups` may be `[]`. Then the slider section is not rendered at all.
- `teams` may be empty for a group. Still render the group only if it has at least one team; a group with zero teams is hidden.

### 2.2 Games

`GET /leagues/:leagueId/games` (public, optional Bearer)

Query params:

| Param | Type | Notes |
|---|---|---|
| `page` | number, default 1 | |
| `pageSize` | number, default 20, max 100 | Use 20. |
| `status` | `SCHEDULED` \| `LIVE` \| `FINISHED` \| `CANCELED` | optional |
| `groupId` | number | optional |
| `leagueTeamId` | number | optional |
| `search` | string | team name contains (home or away) |
| `dateFrom` | Jalali `YYYY/MM/DD` | optional |
| `dateTo` | Jalali `YYYY/MM/DD` | optional |

Note: the public endpoint does NOT accept `resultPending`. Do not send it. The "pending result" switch is therefore NOT in the public drawer (see section 6.3).

Response `data`:

```json
{
  "format": "GROUPS_KNOCKOUT" | ... | null,
  "items": [
    {
      "id": 1,
      "status": "SCHEDULED" | "LIVE" | "FINISHED" | "CANCELED",
      "resultType": "NORMAL" | "FORFEIT" | null,
      "group": { "id": 3, "name": "گروه الف" } | null,
      "homeTeam": { "leagueTeamId": 11, "team": { "id", "name", "logoUrl" }, "organization": {...} | null, "teamStatus"? },
      "awayTeam": { ...same },
      "scheduledDate": "1405/08/16" | null,
      "scheduledTime": "17:00" | null,
      "homeScore": 78 | null,
      "awayScore": 71 | null,
      "winnerLeagueTeamId": 11 | null,
      "forfeitLeagueTeamId": 12 | null,
      "rescheduledFrom": { "id": 7, "status": "CANCELED" } | null,
      "rescheduledTo": { "id": 9, "status": "SCHEDULED" } | null
    }
  ],
  "total": 12,
  "page": 1,
  "pageSize": 20
}
```

Rules:
- `format` not grouped (null, `KNOCKOUT_ONLY`): backend returns `items: []`. Then the games section is hidden too.
- Ordering comes from the backend (scheduled date, time, id). Do not re-sort.
- `winnerLeagueTeamId` is the source of truth for the winner. Never compute the winner in the frontend.

### 2.3 Teams (for the drawer)

`GET /leagues/:leagueId/teams` (public). Use `page=1&pageSize=100`. Response items: `{ id (leagueTeamId), team: { id, name, logoUrl }, organization, ... }`. Use `item.id` as the value and `item.team.name` as the label.

If the response has more than 100 teams, load only the first page; this is acceptable for now.

### 2.4 Endpoints not to use

- Admin endpoints (`/admin/...`).
- Standings endpoints (not built).
- `/leagues/:id` detail already exists and feeds the info card; do not change it.

---

## 3. Store

Read `app/store/league/*` first and mirror its structure exactly.

### 3.1 Option: reuse `leagueStore`

If `leagueStore` already has fields for groups and games, reuse them. Otherwise create a dedicated competition store. Choose ONE of the two and state the choice in your summary. Recommended: a dedicated `competitionStore` so that the existing competition list state (`competitionList`, `competitionLoading`, `competitionLoadingMore`) is not touched.

### 3.2 Dedicated store: `app/store/competition/`

Create three files, mirroring the league store:

**`index.ts`**

```ts
import { defineStore } from "pinia";
import { useCompetitionState } from "./state";
import { useCompetitionActions } from "./actions";

export const useCompetitionStore = defineStore("competitionStore", () => {
  const state = useCompetitionState();
  const actions = useCompetitionActions(state);

  return { ...state, ...actions };
});
```

**`state.ts`**

```ts
import { ref } from "vue";

export function useCompetitionState() {
  const groupsLoading = ref<boolean>(false);
  const groupsFormat = ref<string | null>(null);
  const groups = ref<any[]>([]);

  const gamesLoading = ref<boolean>(false);
  const games = ref<any[]>([]);
  const gamesMeta = ref<any>(null); // { total, page, pageSize }

  const teamOptions = ref<any[]>([]);
  const teamOptionsLoading = ref<boolean>(false);

  return {
    groupsLoading,
    groupsFormat,
    groups,
    gamesLoading,
    games,
    gamesMeta,
    teamOptions,
    teamOptionsLoading,
  };
}
```

**`actions.ts`**

Required functions (names are fixed):

- `getPublicGroups(leagueId: number | string)`
- `getPublicGames(leagueId: number | string, query: GamesQuery)`
- `getPublicLeagueTeams(leagueId: number | string)`
- `resetGames()` (clears `games`, `gamesMeta`)

Rules for every action:
- Use `const axios = useApi();`.
- Set the matching `*Loading` flag to `true` before the request and `false` in `.finally()`.
- On error: `handlerStore.setError(err.response?.data?.message || "خطای سرور")`. Use `console.log(err)` before, like the existing stores.
- Do not call `setSuccess` (these are reads).
- `getPublicGames` uses a `latestRequest` counter: increment before the request, and ignore the response if the counter changed. Copy this pattern from the existing store if present; otherwise implement it inline in `actions.ts` as `let latestRequest = 0;` at the top of `useCompetitionActions`.
- `getPublicGames` removes empty query values before sending (`undefined`, `null`, empty string), like `getCompetitions` does.
- `getPublicGames` reads `res.data.data` and sets `state.games.value = data.items ?? []` and `state.gamesMeta.value = { total, page, pageSize }`.
- `getPublicGroups` sets `groupsFormat` and `groups` from `res.data.data`.
- `getPublicLeagueTeams` sets `teamOptions` from `res.data.data.items` mapped as `{ value: item.id, label: item.team.name }`.

Return from `useCompetitionActions`: `{ getPublicGroups, getPublicGames, getPublicLeagueTeams, resetGames }`.

Type `GamesQuery` locally in `actions.ts` (interface, not exported), with all fields optional except none required.

---

## 4. Page changes: `app/pages/competitions/[slug].vue`

Keep the existing script logic for the info card. Add:

1. Import and use `useCompetitionStore`.
2. In `onMounted`, after the existing `getLeagueById`, call `competitionStore.getPublicGroups(leagueId.value)`. The games list component loads its own data (section 5.2), so the page does not load games.
3. In the template, below the info `<Card>`, add:

```vue
<ViewCompetitionLeagueGroupSlider :league-id="leagueId" class="mt-4" />
<ViewCompetitionLeagueGameList :league-id="leagueId" class="mt-4" />
```

Both components decide their own visibility (section 5). The page does not use `v-if` for them.

4. Keep the `watch(leagueId, ...)`. Extend it so it also calls `competitionStore.getPublicGroups(next)` after `getLeagueById(next)`.

The page `<template>` root keeps `class="mt-2 px-3"`. Do not add extra wrappers.

---

## 5. Components

Both components are under `app/components/view/competition/league/`. Nuxt auto-import name: `ViewCompetitionLeagueGroupSlider` and `ViewCompetitionLeagueGameList`.

Both use `<script setup lang="ts">`, `defineProps<{ leagueId: number | string }>()`, and no `defineEmits` unless needed.

### 5.1 `GroupSlider.vue`

**Visibility**
- Computed `hasGroups = groups.length > 0 && groups.some(g => g.teams.length > 0)`.
- While loading the first time (`groupsLoading && groups.length === 0`): show a skeleton (section 5.1.4).
- When loaded and `!hasGroups`: render nothing (`v-if` on the root element). No title, no message.

**Structure**

Root: `<div v-if="hasGroups || groupsLoading">`.

Inside: `<Swiper>` with `SwiperSlide` per group that has teams. Use the same Swiper setup as `LeagueSlider.vue`: `:slides-per-view="1.08"`, `:space-between="12"`, `dir="rtl"`, `:grab-cursor="true"`. Import `swiper/vue` and `swiper/css` exactly like `LeagueSlider.vue`.

If there is exactly one group, set `:slides-per-view="1"` and `:centered-slides="false"`.

**Slide content (one group)**

Use `Card` + `CardContent` (copy the sizing from `LeagueCard.vue`).

1. Header row (`flex justify-between items-center`):
   - Right side: group name, `text-[15px] font-semibold`.
   - Left side: teams count chip, e.g. `"۴ تیم"`. Render as `{{ group.teams.length }} تیم` with the number formatted by the browser (do not add a number formatter).
   - Chip classes: `w-fit text-[10px] font-semibold rounded-full px-2 py-0.5 bg-gray-200 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400`.

2. Table (`overflow-x-auto`, see 5.1.2).

**5.1.2 Table markup**

Use a native `<table>` with Tailwind classes (no Vuetify, no new UI primitive). Wrap it in `<div class="w-full overflow-x-auto">`.

Columns in this exact order (RTL, so the first column is on the right):

| # | Header (Persian) | Field | Value |
|---|---|---|---|
| 1 | تیم | `team.name` + logo | sticky-left in mobile is NOT needed; keep simple |
| 2 | بازی | played | `—` |
| 3 | امتیاز | points | `—` |
| 4 | برد | won | `—` |
| 5 | باخت | lost | `—` |
| 6 | تفاضل | diff | `—` |

Header row: `text-[12px] text-gray-500 dark:text-gray-400 font-normal`, cells centered except the team column, which is right-aligned.

Body rows: `text-[13px] border-t border-gray-100 dark:border-gray-800`. Each row `py-2`.

Team cell content: a 24x24 round logo (`w-6 h-6 rounded-full border border-gray-300 bg-primary` with `<img>` when `logoUrl`, else `icon-team` fallback like `teamLogo` in `profile/league/[slug]/team/[leagueTeamId].vue`), then the team name in `truncate` with `max-w-[120px]`. Use `dir="rtl"` consistent with the page.

Use the `title` attribute on the team name span with the full name, for long names on tap.

Stat cells: `—` in `text-gray-400`.

Qualification indicator: if `group.qualifiers` is a number and the row index (0-based) is less than `group.qualifiers`, the row gets a right border in primary: `border-r-2 border-primary`. Rows are in registration order, so this is only a visual hint; add a short legend line under the table only if `group.qualifiers` is not null: `"{{ group.qualifiers }} تیم اول صعود می‌کنند"`. Do not sort teams.

**5.1.3 Team order**

Use the order from the API, unchanged.

**5.1.4 Skeleton**

While loading the first time, render 1 `Card` with a `Skeleton` for the header (`h-5 w-28`) and 4 `Skeleton` rows (`h-8 w-full`). Use the `Skeleton` primitive from `~/components/ui/skeleton` exactly as in `LeagueSlider.vue`.

**5.1.5 Accessibility**
- Table: `<caption class="sr-only">جدول گروه {{ group.name }}</caption>`.
- Slide buttons are not needed.

### 5.2 `GameList.vue`

This component owns:
- the games list,
- the filter button,
- the filter drawer (inline in the same file, not a separate component),
- the game cards (inline template, use `v-for` on `games`).

**Visibility**
- While the first load is running (`gamesLoading && games.length === 0`): show skeleton (section 5.2.7).
- When loaded and `games.length === 0` AND no filter is active: render nothing (`v-if` on root). "No filter active" means the default upcoming filter and no user change. Note: the default upcoming filter sets `dateFrom` = today, so "no games" in default mode means "no upcoming games". Per the product decision, the whole games section is hidden when the list is empty. Therefore: when `!gamesLoading && games.length === 0`, render nothing, including the filter button. Filters are still reachable only if there are games; this matches the decision "hidden completely when there are no games". Document this in the summary.

Hmm: if a user applies a filter that returns zero results, the section would disappear and the user could not clear the filter. Resolve it exactly like this (MUST implement):
- Keep the section rendered when `filtersActive` is true, even if `games.length === 0`, and show only a single line `"بازی‌ای با این فیلتر یافت نشد."` and a "حذف فیلترها" button.
- When `filtersActive` is false and `games.length === 0`, render nothing.

Define `filtersActive` as: any filter other than the default (default = only `dateFrom` = today, no other filters). Compare the draft-applied state to the default.

**Default state**
- `dateFrom` default = today in Jalali. Compute with the same approach used elsewhere in the app. Search the app for an existing helper (for example `gregorianToJalali` mirror or `jalali` in `app/`); if none exists, add a one-line computation with the already installed `vue3-persian-datetime-picker` only if it exposes a helper; otherwise use `Intl.DateTimeFormat("fa-IR-u-ca-persian", { timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit" })` and convert the Persian digits to Latin with a small `replace` on `۰-۹`. Format to `YYYY/MM/DD`. The backend expects Latin digits.
- Also keep the sent value identical to what the drawer date picker produces. The date picker `format="jYYYY/jMM/jDD"` returns `YYYY/MM/DD` strings in Jalali; send those.

**7.2 Filter state (local to the component)**

```ts
const emptyFilters = {
  search: "",
  status: "all",       // "all" | SCHEDULED | LIVE | FINISHED | CANCELED
  groupId: "all",
  leagueTeamId: "all",
  dateFrom: defaultDateFrom,
  dateTo: "",
};
const appliedFilters = ref({ ...emptyFilters });
const draft = ref({ ...emptyFilters });
```

- The drawer edits `draft`. "Apply" copies `draft` → `appliedFilters` and closes the drawer. "Clear" resets `draft` and `appliedFilters` to `emptyFilters` (but `dateFrom` stays default, so "clear" returns to the default upcoming view) and reloads.
- `filtersActive` = `appliedFilters` differs from the default (`dateFrom` changed or any other field set).

**7.3 Query building**

Function `buildQuery(page)`:
- `page`, `pageSize: 20`.
- `status` if not `"all"`.
- `groupId` if not `"all"` → `Number(...)`.
- `leagueTeamId` if not `"all"` → `Number(...)`.
- `search` if trimmed non-empty.
- `dateFrom` if non-empty.
- `dateTo` if non-empty.

Never send `resultPending`.

**7.4 Loading and refresh**
- On mount: `loadGames(1)`.
- Watch `appliedFilters` (deep) → `loadGames(1)`.
- `loadGames(page)` calls `competitionStore.getPublicGames(leagueId, buildQuery(page))`.
- Pagination: keep it simple. Use a "more" button at the bottom of the list (`Button` variant outline, full width, text "نمایش بیشتر") that loads `page + 1` and APPENDS. The store's `getPublicGames` replaces `games`; so for "more", the component must merge: add an `append` boolean argument to the store action (`getPublicGames(leagueId, query, append = false)`), which pushes items into `state.games` when `append` is true. Implement this in the store (section 3.2) and document it in actions.ts.
- Show "نمایش بیشتر" only when `games.length < gamesMeta.total`.

**7.5 Search debounce**
- The search input is debounced 300 ms in the drawer draft, not on every keystroke. Apply it only through the Apply button (no live debounce). Simpler and consistent with the admin filter behavior described earlier: applying happens on "اعمال فیلتر". Do NOT add a live debounce.

**7.6 Team filter options**
- On drawer open (`watch(drawerOpen)` when true): if `competitionStore.teamOptions` is empty, call `competitionStore.getPublicLeagueTeams(leagueId)`.
- Team select options come from `teamOptions`.
- When the `groupId` in `draft` changes and the group has teams, you MAY narrow the team options to that group's teams using the groups data already loaded in the store (`groups[].teams`). Implement this narrowing: `teamOptionsForDraft = draft.groupId === "all" ? teamOptions : groupTeams(draft.groupId)`. Map group teams to `{ value: leagueTeamId, label: team.name }`. If a previously selected team is no longer in the narrowed list, reset `draft.leagueTeamId` to `"all"`.

**7.7 Drawer**

Copy the structure of `app/components/view/competition/FilterDrawer.vue`:
- `Drawer` + `DrawerContent class="h-screen max-h-screen mt-0 rounded-none"`, `DrawerHeader` with `DrawerTitle` "فیلتر بازی‌ها" and `DrawerDescription` "بازی‌ها را فیلتر کنید".
- Body `flex flex-col gap-4 px-4`.
- Fields in this order:
  1. جستجو (`Input`, placeholder "نام تیم", with the search icon absolutely positioned as in FilterDrawer).
  2. وضعیت (`Select`): همه, برنامه‌ریزی‌شده (`SCHEDULED`), در حال برگزاری (`LIVE`), تمام‌شده (`FINISHED`), کنسل‌شده (`CANCELED`).
  3. گروه (`Select`): همه + groups from store (`value = String(group.id)`, `label = group.name`). Hide this field if `groups.length === 0` (cannot happen here because the section is hidden, but keep the guard).
  4. تیم (`Select`): همه + teamOptionsForDraft.
  5. از تاریخ (date-picker, `format="jYYYY/jMM/jDD"`, `display-format="jYYYY/jMM/jDD"`, `simple`, `type="date"`, same classes as `profile/organization/team/[slug].vue`'s date-picker).
  6. تا تاریخ (same).
- Footer (`DrawerFooter`): primary `Button` "اعمال فیلتر" (`class="dark:text-gray-300"`), outline `Button` "حذف فیلترها".
- Every field has `CustomLabel` with the same labels, and `aria-label`s (per project rules).
- Use `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectGroup`, `SelectItem` from `~/components/ui/select`. Value `"all"` represents empty, as in FilterDrawer.

Do NOT include a "نتیجه ثبت نشده" switch in the public drawer (section 6.3).

**7.8 Filter button**
- In the component header row (right side): title "بازی‌ها" with `icon-cup` or `icon-date`, and on the left the `Button` size sm variant outline with `icon-filter` and text "فیلتر". Show a small dot like LeagueSlider's page (`absolute ... size-2.5 rounded-full bg-primary`) when `filtersActive`.

**7.9 Game card (inline in the template)**

Layout, mobile first, inside a `Card class="w-full shadow-xs! rounded-4xl gap-3 py-4 mb-2"` and `CardContent class="px-4 flex flex-col gap-3"`:

Row 1 (`flex justify-between items-center text-[12px] text-gray-600 dark:text-gray-300`):
- Right: `scheduledDate` or the text "تاریخ نامشخص". If `scheduledTime`, show it after the date with a separator: `{{ scheduledDate }} · {{ scheduledTime }}`.
- Left: group chip if `game.group` (`bg-gray-200 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400`, text `game.group.name`), and the status chip.

Status chip map (copy classes from LeagueCard status logic):
- `SCHEDULED`: label "برنامه‌ریزی‌شده", class `bg-gray-200 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400`.
- `LIVE`: label "در حال برگزاری", class `bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400`.
- `FINISHED`: label "تمام‌شده", class `bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400`.
- `CANCELED`: label "کنسل‌شده", class `bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400`.

Row 2 (teams and score), `flex items-center justify-between gap-2`:

Layout is RTL. Home team is on the RIGHT, away team on the LEFT. So the DOM order is: home block, center block, away block (in RTL flow, the first element is rightmost).

- Home block (`flex flex-col items-center gap-1 min-w-0 flex-1`):
  - Logo 40x40 round (same fallback as the table).
  - Team name (`text-[13px] font-semibold truncate max-w-full`, with `title`).
  - Organization name (`text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-full`), only if `organization`.
- Center block (`flex flex-col items-center gap-1 shrink-0`):
  - If `status === "FINISHED"` (and `homeScore`/`awayScore` not null): score box row: `[homeScore] - [awayScore]`. Each score is a box `min-w-10 text-center rounded-lg px-2 py-1 text-[18px] font-bold`. The winner's box: `bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400`. The loser's: `bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400`. Winner is decided by `game.winnerLeagueTeamId === game.homeTeam.leagueTeamId` (and the same for away). Never compute from scores.
  - Otherwise: text `VS` (`text-[12px] font-semibold text-gray-500`).
  - If the game has a score but `winnerLeagueTeamId` is null (should not happen), show both boxes without a winner color.
- Away block: same structure as home block, mirrored content order (same markup, order is controlled by DOM order only).

Winner name: when the team is the winner, the team name gets `font-bold text-primary` is NOT allowed (contrast rule). Use `font-bold` only, no color change.

Row 3 (notes), only when they apply, `text-[12px] text-gray-600 dark:text-gray-300`:
- Forfeit (`game.resultType === "FORFEIT"` and `forfeitLeagueTeamId` set): text "فورفیت: {{ name of forfeiting team }} حاضر نشد؛ نتیجه ۲۰ بر ۰ ثبت شده است." Compute the forfeiting team's name from `homeTeam`/`awayTeam` by matching `leagueTeamId` (this is display only, not a winner calculation). Use the score to phrase the 20-0 part only if you want; keep the phrase fixed.
- Canceled with replacement (`status === "CANCELED"` and `rescheduledTo`): "این بازی کنسل شده است؛ بازی جایگزین: شماره {{ rescheduledTo.id }}."
- Replacement (`rescheduledFrom` set): "این بازی جایگزین بازی کنسل‌شده‌ی شماره {{ rescheduledFrom.id }} است."
- Canceled game: card is dimmed (`opacity-60`) and both team names get `line-through`.

Pending result (public, see section 6): the card does NOT show the admin warning. Public users may see a `SCHEDULED` game whose date is in the past as it is. Do not add any pending warning in the public card. (This matches "public never shows admin-only fields"; the pending state is an admin concept.)

Do NOT show: `resultNote`, `cancelReason`, locks, issues, actions, buttons on the card. Cards are read-only.

Card wrapper: no click action (no navigation for now).

Row placement of the card: use `v-for="game in games" :key="game.id"`.

### 5.2.7 Skeleton
While loading first time: 3 cards with `Skeleton` blocks (row 1: `h-4 w-24`; row 2: `h-12 w-full`).

### 5.2.8 "نمایش بیشتر"
Full-width outline `Button` at the bottom, only when more pages exist, with `:disabled="gamesLoading"`.

---

## 6. Behaviour decisions

6.1 Hiding rules summary:
- Groups slider hidden when there are no groups with teams. No title, no message.
- Games section hidden when there are no games AND no filter is active. With an active filter and zero results: keep the section with the single message and "حذف فیلترها" button (section 5.2 rule).
- Groups and games are independent: a league can show games without groups (e.g. KNOCKOUT_ONLY with games in future stages) and vice versa.

6.2 No refresh after writes: this is a public read-only page. The components load on mount and on filter apply only.

6.3 "نتیجه ثبت نشده" is NOT in the public drawer and NOT sent to the API. Public users see all games in their natural states.

6.4 Default filter: `dateFrom` = today (Tehran, Jalali). With this default the list starts from today's games. Users can clear the filter to see past games too.

6.5 Stats in the table are `—` for every row until Stage 4. Do not calculate points, wins, losses from games in the frontend (out of scope, and it would duplicate backend logic).

6.6 Mobile first. Desktop layout is not required; the Swiper handles wide screens naturally.

---

## 7. Styling rules (must follow)

- Tailwind classes only. No `style=""`.
- Use existing tokens and classes already in `LeagueCard.vue`, `LeagueSlider.vue`, `FilterDrawer.vue`. Do not invent new colors.
- Cards: `shadow-xs! rounded-4xl`.
- Text sizes used in the app: `text-[15px]`, `text-[14px]`, `text-[13px]`, `text-[12px]`, `text-[11px]`, `text-[10px]`. Reuse these, do not add others.
- Dark mode: every color class has a `dark:` variant, like the existing components.
- Never use `text-primary` for body text; primary is a background color (project rule). Use `bg-primary` for highlights only.
- `cn()` from `~/lib/utils` for conditional classes; no string concatenation.
- Logos: `rounded-full border border-gray-300 bg-primary`.

---

## 8. Script style (must follow)

- `<script setup lang="ts">` in every component.
- Import order: Vue/Nuxt utils first, then `~/components/ui/*`, then `~/store/*`, then icons, then `~/lib/utils`. Match `LeagueSlider.vue`.
- Props typed with `defineProps<{ ... }>()`.
- Store accessed with `storeToRefs` for refs and direct call for actions, exactly like `LeagueSlider.vue`.
- Comments only where logic is non-obvious. Use the project's `// ─── Section ───` style if sectioning is needed.
- Constants (status labels, status classes) defined as `const` objects at the top of the script, like `statusLabels` in `LeagueCard.vue` / `[slug].vue`.

---

## 9. Implementation order

1. Read all reference files listed in section 1 and note the patterns.
2. Create `app/store/competition/index.ts`, `state.ts`, `actions.ts` (section 3). Do not change `app/store/league`.
3. Create `app/components/view/competition/league/GroupSlider.vue` (section 5.1).
4. Create `app/components/view/competition/league/GameList.vue` (section 5.2, including the drawer and cards).
5. Update `app/pages/competitions/[slug].vue` (section 4): import store, call `getPublicGroups` on mount and on league change, add the two components below the info card.
6. Verify: open a league with groups and games, check slider and list; open a league without groups (only games) and check the slider is absent; open a league with no games and check the games section is absent; apply a filter that returns nothing and check the message and "حذف فیلترها"; check dark mode and RTL alignment.

---

## 10. Acceptance checklist

- [ ] No new composable, no new `components/ui` file, no extra component besides the two listed.
- [ ] Store follows `index.ts` / `state.ts` / `actions.ts`; `useApi`, `handlerStore.setError`, `latestRequest`.
- [ ] Groups slider hidden entirely when no groups; no title or message.
- [ ] Games section hidden entirely when no games and no active filter.
- [ ] Default games view is upcoming games (`dateFrom` = today Tehran, Jalali).
- [ ] Filter drawer has: search, status, group, team, date from, date to. No pending switch.
- [ ] Team options come from `GET /leagues/:id/teams`, narrowed by group when a group is selected.
- [ ] Table columns in order: team, بازی, امتیاز, برد, باخت, تفاضل; stat cells show `—`.
- [ ] Game card: home team on the right, away on the left; winner from `winnerLeagueTeamId`; forfeit and replacement notes; no admin fields.
- [ ] "نمایش بیشتر" appends pages.
- [ ] No inline styles; dark mode variants present; `aria-label` on interactive elements.
- [ ] Script is `<script setup lang="ts">`, same style as neighboring components.

---

## 11. Summary the implementer must report

After implementation, report:
- the list of created and changed files,
- the store option chosen (dedicated `competitionStore`, unless the reading in step 1 showed a reason to reuse `leagueStore`),
- any conflict found between this plan and existing code, and how it was resolved,
- any backend field that was missing or differs from section 2.