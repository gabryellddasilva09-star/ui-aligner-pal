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

- Keep the daily check-in in a reusable frontend dialog with schema-validated session state; this visual prototype must not introduce clinical logic or a backend.
- Keep the interactive body pain map in a reusable frontend component with browser-safe region definitions and schema-validated per-region intensities; silhouette and list selections share the same state for accessibility.
- Keep relaxation content, session timing, and reusable frontend controls separate; use validated browser-local history and reminder preferences because this prototype has no backend or real notifications.
- Serve pre-rendered relaxation audio through asset pointers; playback must start only after user interaction and stop when leaving the screen.
- Keep inline breathing timing in a reusable frontend control and reuse the shared sound selector in controlled playback mode so time, progress, and audio pause together.
