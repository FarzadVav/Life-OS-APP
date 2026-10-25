# Clean Code & Refactor

- Fix RichTextEditor tools and the UI bugs, And check the all usages
- Create the CardView component (Direct styles, card and card-thick Colors, Static structure with icon, title and description)
- Create the CardDrawer component above on CardView (No internal buttons or links, Open the drawer on click, Static drawer structure with title, content and editHref)
- Replace the all raw tabs with SlideTabs component
- Replace the all raw alerts with EmptyAlert component
- Create Skeleton component and replace the all raw loading with that
- Auth (Deep authentication in the (user) layout, Deep authorization in the repositories, mutations and queries (Maybe DAL))
- I18N (Check that everything be in the translation, Remove the default values)
- Helps (Remove the uselesses and optimize the requires)
- Store the dates and times with the UTC timestamp format and show them with localization
- Remove repeat-interval from missions disciplines and habits
- Rename habits to habits-n-rules (Habits and Rules)
- PWA (the offline page, the occasional script error)
- Implementation of folders, files, code-splitting, tsx/html, styles
- Implementation of states, hooks, fetches, actions, forms
- Implementation of db, orm, repositories, queries, mutations

---

# Features

- Add "tags" field for journals
- Add "active" field for life-ares
- Add "anytime" state for daily, upcoming and missions actions and disciplines todos

---

# Next Versions

- Add repeat-interval with a stack for missions disciplines (Stack should handle with cron jobs)
- Add pending state for missions (With a start date)