---
name: "Update Project Knowledge"
description: "Summarize durable, verified project knowledge from this chat and update the repository knowledge Markdown file. Run at the end of a chat or implementation task."
argument-hint: "Optional focus area or files to prioritize"
agent: "agent"
tools: [read, search, edit]
---
Update the repository's durable project knowledge based on this conversation and relevant workspace files.

## Source and Scope
- Use the current conversation for decisions, implementation discoveries, and outcomes. Inspect relevant workspace files when needed to verify facts.
- Treat the root `PROJECT_KNOWLEDGE.md` as the destination. Create it if it does not exist; otherwise update the existing sections in place and remove stale or duplicated facts when clearly superseded.
- Record only reusable project knowledge: architecture and ownership, confirmed conventions, important invariants, validated commands, and unresolved follow-up that future work needs to know.
- Clearly label unresolved or unverified details. Do not turn assumptions into facts.
- Never record secrets, credentials, tokens, personal data, or sensitive values. Do not copy large code blocks or routine chat summaries into the knowledge file.
- Do not modify application code, configuration, migrations, or other documentation as part of this task.

## Update Process
1. Identify candidate facts from the conversation, including what changed and what was verified.
2. Check existing knowledge and relevant files for accuracy, relevance, and duplication.
3. Make the smallest useful edit to `PROJECT_KNOWLEDGE.md`, preserving valid existing information and its style.
4. If the chat produced no durable knowledge, leave the file unchanged and say so.
5. Report the knowledge topics added, changed, or left unchanged, and note any uncertainty.
