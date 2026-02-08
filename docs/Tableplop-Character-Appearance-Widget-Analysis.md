# Tableplop "Character" Tab: Appearance Widget Analysis

This document describes how to handle the character portrait widget in the Tableplop template.

- Tab: Character (id: 77228047)
- Section: Character Details (parent container id: 77227840)
- Target property: Appearance widget
  - id: 77228084
  - parentId: 77227840
  - type: appearance
  - data: { "appearances": [] }
  - rank: leave unchanged
  - characterId: preserve

Pathbuilder integration
- Pathbuilder provides no portrait or appearance data compatible with this widget.
- Therefore, this widget is player-managed only.

Behavior
- Do not create, modify, or remove the appearance widget programmatically.
- Do not attempt to populate or transform data.appearances from Pathbuilder.
- Preserve all existing user-added images or entries in data.appearances.
- If the widget exists in the template, leave it as-is; if it does not exist, do not create it.

Notes
- This widget is intended for players to upload or link portrait images.
- Any automation that manipulates Character Details should explicitly exclude type: "appearance" records.