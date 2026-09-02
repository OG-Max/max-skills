# Git forge portability

Keep the canonical workflow forge-neutral, then select an adapter from the detected remote. Never require GitHub for a GitLab-hosted repository.

## Detect the forge

Inspect, do not mutate:

```bash
git remote -v
git config --get remote.origin.url
```

Classify `github.com` as GitHub and the public `gitlab.com` plus self-hosted GitLab domains as GitLab. A self-hosted hostname may be ambiguous; inspect existing CI and repository metadata or ask the user. Never infer a forge only from the presence of a CLI binary.

## Terminology and tools

| Operation | GitHub | GitLab | Forge-neutral guidance |
| --- | --- | --- | --- |
| Change review | Pull request | Merge request | Say “change request” until the forge is known. |
| CLI | `gh` | `glab` | Check availability and authentication before use; normal `git` operations remain valid without either CLI. |
| CI configuration | `.github/workflows/*.yml` | `.gitlab-ci.yml` and included CI files | Edit only the detected platform's configuration unless dual support is requested. |
| Issue reference | GitHub issue URL/number | GitLab issue URL/IID | Preserve full URLs when moving context across forges. |
| Review metadata | PR title/body | MR title/description | Generate equivalent content without assuming platform-specific fields. |

## Change-request workflow

1. Inspect the remote and current branch.
2. Make and validate the requested changes locally.
3. Commit only when requested or required by the surrounding workflow.
4. Push only when requested and credentials are available.
5. On GitHub, use the configured GitHub integration or `gh pr create` when available.
6. On GitLab, use the configured GitLab integration or `glab mr create` when available.
7. If no forge integration is available, return a ready-to-use title and description; do not claim a PR or MR was created.

## Authentication and API safety

- Do not print or commit GitHub tokens, GitLab tokens, credential-helper output, or authenticated remote URLs.
- Do not silently replace SSH remotes with HTTPS remotes.
- Support self-hosted GitLab by respecting the existing hostname and CLI configuration.
- Treat GitHub and GitLab MCP servers as separate optional dependencies.
- Prefer repository scripts for validation; do not translate a GitHub Actions job into GitLab CI unless dual CI support is explicitly requested.

## Validation

For a GitLab target, search executable guidance for accidental `gh`, `api.github.com`, `.github/workflows`, and pull-request-only steps. For a GitHub target, search for accidental `glab`, `.gitlab-ci.yml`, and merge-request-only steps. Human-readable comparisons are allowed; failures are platform-specific executable assumptions.
