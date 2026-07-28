---
name: graphify
description: "Wrapper for the Graphify CLI. Use this skill to initialize and interact with graphify graphs (graphify .), query them, and export them."
---

# /graphify

Turn any folder of files into a navigable knowledge graph.

## Usage

```
/graphify                                             # Initialize and build graph on current project (graphify .)
/graphify <path>                                      # Build graph on specific path (graphify <path>)
/graphify query "<question>"                          # Query the graph
/graphify update                                      # Update existing graph
/graphify export html                                 # Export to HTML
/graphify export obsidian                             # Export to Obsidian vault
```

## What You Must Do When Invoked

**CRITICAL - PROJECT ROOT CONTEXT:**
You MUST determine the correct project root before running anything. If the user invokes graphify from a specific project, you MUST use that project's absolute path (e.g., the active workspace from your `<user_information>` block). NEVER run graphify on a different project or fallback to a previous project. ALL tool calls MUST set their `Cwd` to this target project root.

### Step 1 - Check and Install Graphify

Ensure `graphify` is installed:
```powershell
if (!(Get-Command graphify -ErrorAction SilentlyContinue)) {
    pip install graphifyy
}
```

### Step 2 - Execute Graphify

To build or initialize the graph for the project, execute the CLI tool directly:
```powershell
# Make sure to run this inside the correct Cwd
graphify .
```

*Note: If `graphify` requires an LLM API key (like `GEMINI_API_KEY`) for processing documentation/images and it is not set, you can run `graphify . --code-only` to skip semantic extraction, or ask the user to configure their API key.*

### Step 3 - Present Results

When `graphify .` finishes, it generates output in the `graphify-out` directory (like `GRAPH_REPORT.md` and `graph.html`).
Read `graphify-out/GRAPH_REPORT.md` and summarize the results for the user (mentioning God Nodes, Surprising Connections, and Suggested Questions). Ask if they want to query the graph.

---

## Utilities & Subcommands

To execute any other graphify utility, simply run the corresponding `graphify` CLI command in the terminal.

- **Query**: `graphify query "your question"`
- **Update**: `graphify update`
- **Export HTML**: `graphify export html`
- **Export Obsidian**: `graphify export obsidian`
- **Check Health**: `graphify diagnose`
- **Help**: `graphify --help`
