<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the daily check-in in a reusable frontend dialog with schema-validated state; persist records per user through the shared records hooks with owner-only RLS so every screen reads the same real data.
- Keep the interactive body pain map in a reusable frontend component with browser-safe region definitions and schema-validated per-region intensities; silhouette and list selections share the same state for accessibility.
- Keep relaxation content, session timing, and reusable frontend controls separate; persist finished sessions to the user's account; relaxation reminder preferences stay browser-local.
- Serve pre-rendered relaxation audio through asset pointers; playback must start only after user interaction and stop when leaving the screen.
- Keep inline breathing timing in a reusable frontend control and reuse the shared sound selector in controlled playback mode so time, progress, and audio pause together.
- Keep nutrition source content separate from reusable food visuals and progressive-disclosure controls so presentation changes never rewrite the supplied meal plan.
- Keep looping card carousels in one reusable frontend component that clones its items for seamless wrap, keeps off-screen slides inert, and stops auto-advance on hover, focus, open dialogs, drag and reduced-motion, so any section can adopt it without new dependencies.
- Send reminders as payload-less Web Push signed with a database-stored VAPID key and fetch the message from the service worker, because Workers lack Node push libraries and payload encryption; the scheduler authenticates with a token kept only in a service-role table.
- Keep the messaging service worker separate from any app-shell caching so installability never introduces offline caching.
- Keep guided-program content in a browser-safe data module separate from progress, which is stored per user with owner-only RLS; daily program reminders reuse the shared push scheduler.
- Keep the exercise catalog in a shared browser-safe data module and weekday assignments in owner-only account storage accessed through shared hooks, so the catalog and movement plan always use the same saved schedule.
- Keep supplied exercise instructions and matching PDF illustrations together in the shared catalog; derive ID validation from that catalog and retain legacy entries only for existing plans so content updates never reinterpret saved activities.
- Derive movement activities only from saved weekday assignments and persist completions per user, exercise and local calendar date, so progress starts at zero and never carries over to another day.
- Keep library content in the shared browser-safe knowledge data module and render topic articles through the parameterized knowledge route, so filtering and reading reuse the same educational text.
- Render account and notification controls only through AppShell's viewport-specific top bars, never inside page headers, to prevent duplicate controls.
