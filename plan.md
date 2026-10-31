# Plan: Competitions Page (Frontend, Nuxt PWA)

Everything in this plan happens on the **Competitions** page. Nothing else in the app is changed.

**Prerequisite:** the backend plan `public-dropdowns-backend-plan.md` is done (`GET /dropdown/seasons`, `GET /dropdown/age-categories`).

## 1. Scope and rules

**Allowed**

- New files listed in section 3.
- _Additive_ changes to two existing stores (`store/league`, `store/base`): new state + new actions only.
- `npm install swiper`.

**Forbidden** (explicitly out of scope, handled in later plans)

- `BottomNav.vue` (its "مسابقات" item still points to `/`; link change is a separate decision).
- Any existing store state/action/behavior (`leagueList`, `myLeagueList`, `getLeagues`, ...).
- Profile pages/components, `league/Detail.vue`, axios plugin, layouts.
- Content of the league detail page (placeholder only).

**Page access:** public. No `auth` middleware in `definePageMeta`.

## 2. Install Swiper

```bash
npm install swiper
```

- Use `swiper/vue` (`Swiper`, `SwiperSlide`) and import `swiper/css` inside the slider component.
- RTL: the app already sets `<html dir="rtl">`; also pass `dir="rtl"` on `<Swiper>` explicitly so slide order and swipe direction are right-to-left.
- No Nuxt module needed. Use the Swiper component directly.
- SSR: Swiper Vue renders on the server; if hydration warnings appear, wrap the slider in `<ClientOnly>` with the skeleton as `#fallback`.

## 3. Files

New:

```
app/pages/competitions/index.vue                      # the page
app/pages/competitions/[slug].vue                     # placeholder only
app/components/view/competition/LeagueSlider.vue      # Swiper + infinite loading
app/components/view/competition/LeagueCard.vue        # one league card
app/components/view/competition/FilterDrawer.vue      # filter drawer
app/components/icon/filter.vue                        # new icon (same style as other icon/*.vue)
```

Edited (additive):

```
app/store/league/state.ts     # + competition state
app/store/league/actions.ts   # + getCompetitions
app/store/league/index.ts     # unchanged (spreads state/actions automatically)
app/store/base/state.ts       # + seasonOptions, ageCategoryOptions
app/store/base/actions.ts     # + getSeasonOptions, getAgeCategoryOptions
```

Auto-import names: `ViewCompetitionLeagueSlider`, `ViewCompetitionLeagueCard`, `ViewCompetitionFilterDrawer`, `icon-filter`.

## 4. Store changes

### 4.1 `store/league` (separate from profile state)

State (new refs, returned from `useLeagueState`):

| State                    | Type                                | Purpose                                       |
| ------------------------ | ----------------------------------- | --------------------------------------------- |
| `competitionList`        | `any[]`                             | accumulated leagues for the page              |
| `competitionListMeta`    | `{ total, page, pageSize } \| null` | pagination meta                               |
| `competitionLoading`     | `boolean`                           | first-page / filter-change loading (skeleton) |
| `competitionLoadingMore` | `boolean`                           | next-page loading (end-of-slider loader)      |

Action `getCompetitions(query, append = false)`:

- `query`: `{ page, pageSize, status?, seasonId?, ageCategoryId?, search? }`. Strip empty/undefined values before sending.
- Calls public `GET /leagues`.
- `append === false`: set `competitionLoading`, replace `competitionList`, set meta.
- `append === true`: set `competitionLoadingMore`, push `items` onto `competitionList` (skip ids already present), update meta.
- Errors: same pattern as other actions (`console.log`, `handlerStore.setError(message || "خطای سرور")`). Always clear the corresponding loading flag in `finally`.
- Stale-response guard: keep a module-level request counter inside the action; ignore a response if a newer non-append request started meanwhile (prevents old filter results overwriting new ones).
- Return `res.data.data` so the caller can read `items`.

Do **not** reuse or modify `leagueList`, `leagueListMeta`, `getLeagues`, `myLeagueList`.

### 4.2 `store/base`

State: `seasonOptions` (`any[]`), `ageCategoryOptions` (`any[]`).

Actions (same style as `getSeasons`):

- `getSeasonOptions()` → `GET /dropdown/seasons?pageSize=100` → `state.seasonOptions = res.data.data.items` (each `{ value, label, isActive }`).
- `getAgeCategoryOptions()` → `GET /dropdown/age-categories?pageSize=100` → `state.ageCategoryOptions = res.data.data.items` (each `{ value, label }`).

Both are public endpoints; no token needed. Skip the request if the list is already loaded (`length > 0`).

Status options are **not** fetched: a local constant in the filter drawer (see 6.3), because only `REGISTRATION | ACTIVE | FINISHED` are valid for public `GET /leagues`.

## 5. Page: `app/pages/competitions/index.vue`

Layout: default layout (header + BottomNav come from it). No `definePageMeta` middleware.

Structure:

```
<div class="mt-2">
  header row   : [cup icon] لیگ‌ها ............ [filter button (dot if active)]
  <ViewCompetitionLeagueSlider :filters="appliedFilters" />
  <ViewCompetitionFilterDrawer v-model:open="filterOpen" :model-value="appliedFilters" @apply="applyFilters" />
</div>
```

Header row matches the section headers used elsewhere (e.g. `league/MyTeamList.vue`):

- Left (start side in RTL): `icon-cup` (`size-3.75 text-gray-500 dark:text-gray-300`) + text «لیگ‌ها» (`text-[13px] text-gray-500 dark:text-gray-300`).
- Other side: `Button` `size="sm" variant="outline"` with `icon-filter` and label «فیلتر». When any filter is active, show a small primary-colored dot (absolute, top corner) on the button.

Page state:

- `filterOpen = ref(false)`
- `appliedFilters = ref({ search: "", status: null, seasonId: null, ageCategoryId: null })`
- `hasActiveFilter = computed(...)` → any non-empty value.
- `applyFilters(value)` replaces `appliedFilters` and closes the drawer. The slider watches the prop and reloads from page 1.

Default filters: none (all non-INACTIVE leagues; backend already hides INACTIVE from public).

## 6. Components

### 6.1 `LeagueCard.vue`

Props: `league` (the item from `GET /leagues`). Based on the visual of `league/Detail.vue` with these differences:

- **No** edit/delete/register buttons. **Status chip** takes their place (top corner, opposite the title block). Reuse the same `statusLabels` / `getStatusClass` logic (copy locally; do not import from other components).
- Header: cup circle (`w-20 h-20 rounded-full bg-primary`, `icon-cup size-9 text-white`), title `league.name`.
- Under the title: `league.season.name | league.ageCategory.name` (separated by `|`, `text-[13px] text-gray-600 dark:text-gray-300`). Do not show `teamsCount` or description.
- Three info boxes in `grid grid-cols-3 gap-3`: «تاریخ شروع» (`startDate`), «تاریخ پایان» (`endDate`), «مهلت ثبت‌نام» (`rosterDeadline`).
  - **Always rendered**, value `—` when null, so every card has the same height.
  - Same padding on all three (`p-3`; note: the first box in `Detail.vue` lacks it, do not copy that), icons `icon-date-number` ×2 and `icon-date-plus`.
- Bottom: full-width `Button` «مشاهده» as `NuxtLink` to `/competitions/${league.id}` (`as-child` or `NuxtLink` wrapping, `size="sm"`, `aria-label="مشاهده لیگ"`).
- Card: `Card class="w-full shadow-xs! rounded-4xl py-5 gap-4 h-full"`. Content is flex-column with the button pinned to the bottom (`mt-auto`) so equal-height slides look aligned.
- Dates arrive already in Jalali (`YYYY/MM/DD`); display as-is.
- Accessibility: `aria-label`s in Persian, as elsewhere.

### 6.2 `LeagueSlider.vue`

Props: `filters`.

Behavior:

- Constants: `pageSize = 10`.
- From `useLeagueStore` via `storeToRefs`: `competitionList`, `competitionListMeta`, `competitionLoading`, `competitionLoadingMore`.
- `load(reset)`:
  - reset → `getCompetitions({ page: 1, pageSize, ...filters }, false)`, then `swiper.slideTo(0, 0)`.
  - more → `getCompetitions({ page: meta.page + 1, pageSize, ...filters }, true)`.
- `hasMore = computed(() => meta && list.length < meta.total)`.
- Load on mount; `watch(() => props.filters, () => load(true), { deep: true })`.
- Infinite loading: on Swiper `@slideChange` (and `@reachEnd` as a fallback), if `activeIndex >= list.length - 2 && hasMore && !loadingMore && !loading` → `load(false)`. While loading more, render one extra skeleton slide at the end.
- Capture the Swiper instance from `@swiper="onSwiper"`; call `swiper.update()` after new slides are appended.

Swiper config:

```
dir="rtl"
:slides-per-view="items.length > 1 ? 1.15 : 1"
:space-between="12"
:centered-slides="items.length > 1"
:grab-cursor="true"
class="!overflow-visible"? (no: keep default overflow; the peeking comes from slides-per-view 1.15)
```

- Slides must have equal height: set `class="!h-auto"` on `SwiperSlide` and the wrapper `items-stretch`; card uses `h-full`.
- Peek effect (partial neighbors on both sides as in the mockup) comes from `slidesPerView: 1.15` + `centeredSlides: true` + `spaceBetween`. If neighbors are too small/large, tune 1.1–1.25.
- With a single league: `slidesPerView: 1`, no centering, no peek.
- Page horizontal padding of the default layout (`px-3`) clips the peek on the outer edge; that is acceptable (the mockup shows partial cards inside the viewport). If it looks cut, apply negative margin (`-mx-3 px-3`) on the slider wrapper only.

States:

- **Loading (first page / filter change):** skeleton card (copy structure of the real card with `Skeleton`), `aria-hidden`.
- **Empty:** a `Card` like the empty states in `league/MyTeamList.vue`: `icon-cup`, text «لیگی یافت نشد», and, if filters are active, a small «حذف فیلترها» button that emits `clear`.
- **Error:** the store already shows a toast; if the list is empty show the same empty card.

### 6.3 `FilterDrawer.vue`

Drawer pattern identical to other pages (`Drawer` + `DrawerContent class="h-screen max-h-screen mt-0 rounded-none"`, header title «فیلتر لیگ‌ها», description «لیگ‌ها را فیلتر کنید»).

Props/emits: `open` (v-model), `modelValue` (applied filters), `apply(filters)`.

Local draft state (copied from `modelValue` each time the drawer opens, so closing without applying discards changes):

| Order | Field          | Control                                           | Source                                                                                |
| ----- | -------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1     | جستجو (search) | `Input` with `icon-search`, placeholder «نام لیگ» | free text, trimmed                                                                    |
| 2     | وضعیت          | `Select` (shadcn, `dir="rtl"`)                    | local constant: `REGISTRATION` در حال ثبت‌نام, `ACTIVE` در جریان, `FINISHED` تمام‌شده |
| 3     | فصل            | `Select`                                          | `baseStore.seasonOptions` (`value`/`label`)                                           |
| 4     | رده سنی        | `Select`                                          | `baseStore.ageCategoryOptions` (`value`/`label`)                                      |

- Each `Select` has a first item «همه» meaning "no filter". shadcn/reka `Select` does not allow an empty-string value, so use a sentinel (`"all"`) and map it to `null` on apply.
- Use the same `Select` markup as `Coach.vue` (`SelectTrigger class="w-full"`, `SelectContent dir="rtl"`, `SelectGroup`, `SelectItem class="px-3"`).
- Labels via `CustomLabel` (no required asterisk).
- On drawer open: call `baseStore.getSeasonOptions()` and `getAgeCategoryOptions()` (skipped if already loaded).
- Footer: primary `Button` «اعمال فیلتر» (emits `apply` with normalized values) and a `variant="outline"` «حذف فیلترها» (resets the draft and emits `apply` with empty filters).
- Normalization on apply: `search.trim()` → `""` becomes `null`; sentinel → `null`; season/ageCategory ids as numbers.
- Search is submitted with the apply button (not live), consistent with the rest of the drawer fields.

## 7. Placeholder: `app/pages/competitions/[slug].vue`

Public page, no middleware, minimal content: a centered empty-state card («صفحه لیگ به‌زودی». no data fetching). Its real content (tabs: جدول / برنامه / براکت / تیم‌ها) belongs to a separate plan.

## 8. Responses used

`GET /leagues` item (public) fields used by the card: `id`, `name`, `status`, `startDate`, `endDate`, `rosterDeadline`, `season { id, name }`, `ageCategory { id, name }`. Pagination: `{ items, total, page, pageSize }`.

## 9. Implementation order

1. `npm install swiper`.
2. Store additions (`league`, `base`).
3. `icon/filter.vue`.
4. `LeagueCard.vue` (with static sample data to check heights).
5. `LeagueSlider.vue` (Swiper, skeleton, empty, infinite loading).
6. `FilterDrawer.vue`.
7. `competitions/index.vue` wiring.
8. `competitions/[slug].vue` placeholder.

## 10. Acceptance checklist

- Opening `/competitions` without logging in works and lists leagues; filter drawer dropdowns load without a token.
- Cards show: name, status chip (no edit/delete), `season | age category`, three date boxes (`—` when empty), «مشاهده» button; all cards are the same height.
- Neighboring cards peek on both sides; swipe direction is RTL.
- Swiping near the last slide loads the next page and appends it without jumping; no duplicates; stops when `total` is reached.
- Applying any filter resets to page 1, scrolls the slider to the first slide, and an older in-flight response never overwrites the newer one.
- Closing the drawer without applying discards the draft; «حذف فیلترها» clears everything; the dot on the filter button reflects active filters.
- Empty result and loading skeleton states work; profile pages and existing stores behave exactly as before.
- Dark mode and mobile widths (≈360px) look correct.

## 11. Out of scope (separate plans)

- `BottomNav` link to `/competitions`.
- League page content and tabs (groups table, schedule, bracket, teams).
- Any change to existing store behavior or profile components.
