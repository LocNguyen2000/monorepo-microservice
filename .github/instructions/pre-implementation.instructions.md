---
description: For coding tasks, create a separate branch before implementation and do not stage or commit unless explicitly requested. For new features, write plan.md first; after implementation, run /update-project-knowledge to update repository knowledge.
# applyTo: 'Always plan first when receiving a new feature, after every implementation, you must run the update-project-knowledge prompt to summarize and update the repository knowledge file. This ensures that the project knowledge is always up to date and accurate.' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

## Workflow

- Create and switch to a separate Git branch for each coding task before implementation.
- Do not stage or commit changes unless the user explicitly requests it.
- For each new feature, write the implementation plan to `plan.md` before editing implementation files.
- After each implementation, run `/update-project-knowledge` to summarize verified changes and update the repository knowledge file.