# Prompt Logging Rule

For all future prompts provided by the user in this workspace, you MUST document the prompt in the Notion "Prompt Log" database (Database ID: 39822275-9c68-8020-8741-e0112d5bb6dd).

For each prompt, you must log:
1. **Prompt Text**: The exact text of the user's prompt.
2. **Prompt Quality**: A brief evaluation of the prompt's quality (e.g., "Good", "Excellent", "Needs Clarity").
3. **Suggestions**: Any suggestions for how the user could improve the prompt in the future (or "None" if it's already perfect).

Use the `notion-mcp-server` and the `API-post-page` tool to insert these entries into the database for every new request.
