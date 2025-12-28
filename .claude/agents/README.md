# Claude Code Sub-Agents for Enterprise SaaS Development

This directory contains 11 specialized sub-agents for building enterprise multi-tenant SaaS applications.

## Installation

1. Copy all `.md` files to your project's `.claude/agents/` directory:
   ```bash
   cp *.md /path/to/your/project/.claude/agents/
   ```

2. Start Claude Code:
   ```bash
   cd /path/to/your/project
   claude
   ```

3. Start using agents:
   ```bash
   > "Design a user authentication system"
   # → Uses solution-architect automatically
   
   > "@backend-engineer Implement the user API"
   # → Uses backend-engineer explicitly
   ```

## Available Agents

1. **solution-architect.md** - System architecture and design
2. **database-architect.md** - Database schema and optimization  
3. **security-architect.md** - Security design and compliance
4. **ui-designer.md** - UI/UX design and components
5. **backend-engineer.md** - API development and business logic
6. **frontend-engineer.md** - React components and state management
7. **devops-engineer.md** - CI/CD, Docker, Kubernetes
8. **qa-engineer.md** - Test planning and manual testing
9. **test-automator.md** - Automated testing (unit/integration/E2E)
10. **security-auditor.md** - Security auditing and vulnerability scanning
11. **agent-organizer.md** - Multi-agent workflow coordination

## Quick Start Examples

```bash
# Architecture design
> "@solution-architect Design a multi-tenant notification system"

# Database schema
> "@database-architect Create schema for invoice management"

# Backend implementation
> "@backend-engineer Implement user CRUD API with tenant isolation"

# Frontend development
> "@frontend-engineer Build a responsive dashboard with charts"

# Testing
> "@test-automator Write comprehensive tests for the auth module"

# Complete feature
> "@agent-organizer Build a reports dashboard with metrics and charts"
```

## Documentation

- **Quick Reference**: `../claude-code-quick-reference.md`
- **Complete Guide**: `../complete-claude-code-dev-team-guide.md`

