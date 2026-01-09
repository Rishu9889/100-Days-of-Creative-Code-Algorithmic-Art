# 🤖 Auto Message Bot

This directory contains the message templates used by the GitHub Actions workflow to automatically post welcome messages and helpful information on new Pull Requests and Issues.

## 📁 Directory Structure

```
auto-messages/
├── README.md              # This file
├── pr-welcome.md          # Template for new Pull Requests
├── issue-welcome.md       # Template for new Issues
├── first-time-contributor.md  # Extra welcome for first-time contributors
└── missing-info.md        # Reminder when issue lacks details
```

## 🎯 How It Works

The workflow (`.github/workflows/auto-message.yml`) automatically:

1. **Triggers** on newly opened PRs and Issues
2. **Detects** if the contributor is a first-time contributor
3. **Checks** if Issues have sufficient information
4. **Posts** appropriate welcome comments

## 📝 Template Placeholders

You can use these placeholders in your templates:

| Placeholder | Description |
|-------------|-------------|
| `{{username}}` | The GitHub username of the contributor |
| `{{pr_number}}` | The Pull Request number (PR templates only) |
| `{{issue_number}}` | The Issue number (Issue templates only) |
| `{{repo_name}}` | The repository name |

## ✏️ Customizing Messages

To customize any message:

1. Edit the corresponding `.md` file in this directory
2. Commit and push your changes
3. The new message will be used for future PRs/Issues

### Example Customization

```markdown
## 🎉 Welcome, @{{username}}!

Thanks for your contribution to {{repo_name}}!
Your PR #{{pr_number}} is being reviewed.
```

## 🔧 Configuration

The workflow is configured in `.github/workflows/auto-message.yml`:

- **Triggers**: `issues.opened`, `pull_request.opened`
- **Permissions**: `issues: write`, `pull-requests: write`
- **First-time detection**: Checks previous PRs and Issues by the user
- **Missing info detection**: Checks if issue body is too short or empty

## 📊 Use Cases

| Event | First-Time? | Missing Info? | Messages Posted |
|-------|-------------|---------------|-----------------|
| New PR | No | N/A | PR Welcome |
| New PR | Yes | N/A | First-Time + PR Welcome |
| New Issue | No | No | Issue Welcome |
| New Issue | Yes | No | First-Time + Issue Welcome |
| New Issue | No | Yes | Issue Welcome + Missing Info |
| New Issue | Yes | Yes | First-Time + Issue Welcome + Missing Info |

## 🐛 Troubleshooting

### Messages not appearing?

1. Check the Actions tab for workflow runs
2. Verify the workflow has the correct permissions
3. Ensure `GITHUB_TOKEN` has write access

### Template not loading?

1. Verify the file exists in `.github/auto-messages/`
2. Check the file name matches exactly (case-sensitive)
3. Ensure the file has valid Markdown content

## 📖 Related Files

- **Workflow**: [`.github/workflows/auto-message.yml`](../workflows/auto-message.yml)
- **Contributing**: [`Contributing.md`](../../Contributing.md)
- **Code of Conduct**: [`CODE OF CONDUCT.md`](../../CODE%20OF%20CONDUCT.md)

---

Made with ❤️ for better contributor experience!
