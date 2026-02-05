# Contributing

## Project Board

Track tasks and progress on our [Trello Board](https://trello.com/b/yM8iYCkm/pokemon-battle).

## Branch Naming

```
feature/feature-name    # New feature
fix/bug-name            # Bug fix
docs/what-documented    # Documentation
refactor/what-changed   # Code refactoring
```

**Examples:**
- `feature/home-pokemon-list`
- `fix/roster-localStorage-bug`
- `docs/readme-setup`

## Workflow

1. Create branch from `main`
2. Develop and test feature
3. `npm run lint` and `npm run build` must pass
4. Create PR with clear title and description
5. Wait for review, implement feedback
6. After approval: Merge and delete branch

## Commit Messages

Format: `type: short description`

| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting |
| `refactor` | Code restructuring |
| `test` | Tests |
| `chore` | Config, dependencies |

**Examples:**
```
feat: add pokemon card component
fix: correct battle score calculation
docs: add setup instructions to README
```

## PR Rules

- **One PR = one topic** - no mixed features
- **Keep it small** - max 200-400 lines diff if possible
- **Clear title** - describes what the PR does
- **Description** - What, Why, How to test

## Code Quality

Before every PR:
```bash
npm run lint    # must pass
npm run build   # must pass
```

## Review Checklist

- [ ] Code is readable and understandable
- [ ] No `any` types without good reason
- [ ] Loading and error states present
- [ ] Mobile responsive tested
- [ ] No secrets in code
