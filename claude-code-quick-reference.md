# Claude Code Sub-Agents Quick Reference

## 🚀 Quick Start

```bash
# 1. Create directory
mkdir -p .claude/agents

# 2. Copy sub-agent .md files to .claude/agents/

# 3. Start Claude Code
claude

# 4. Make requests
> "Design a user authentication system"
```

## 📋 Available Agents

| Agent | Use When | Tools |
|-------|----------|-------|
| **solution-architect** | Overall system design, architecture decisions | Read, Grep, Glob |
| **database-architect** | Database schema, queries, optimization | Read, Grep, Glob |
| **security-architect** | Security design, auth, compliance | Read, Grep, Glob |
| **ui-designer** | UI/UX design, components, accessibility | Read, Grep, Glob |
| **backend-engineer** | API development, business logic | Read, Write, Edit, Bash |
| **frontend-engineer** | React components, state management | Read, Write, Edit, Bash |
| **devops-engineer** | CI/CD, Docker, Kubernetes, deployment | Read, Write, Edit, Bash |
| **qa-engineer** | Test planning, manual testing, UAT | Read, Write |
| **test-automator** | Unit tests, integration tests, E2E tests | Read, Write, Edit, Bash |
| **security-auditor** | Code review, vulnerability scanning | Read, Bash, Grep |
| **agent-organizer** | Multi-agent coordination, complex workflows | All |

## 💡 Usage Patterns

### Automatic Selection
```bash
> "Design a scalable architecture for 10K users"
# → Uses solution-architect automatically

> "Implement user CRUD API"
# → Uses backend-engineer automatically

> "Write tests for user management"
# → Uses test-automator automatically
```

### Explicit Agent Request
```bash
> "@solution-architect Design authentication flow"
> "@backend-engineer Implement the auth API"
> "@security-auditor Review this code for vulnerabilities"
```

### Multi-Agent Workflow
```bash
> "@agent-organizer Build a complete invoice feature with:
   - Architecture design
   - Backend API
   - Frontend UI
   - Tests
   - Deployment"
```

## 🔄 Common Workflows

### New Feature Development
```
1. Architecture → @solution-architect
2. Database     → @database-architect
3. Backend      → @backend-engineer
4. Frontend     → @frontend-engineer
5. Testing      → @test-automator + @qa-engineer
6. Security     → @security-auditor
7. Deploy       → @devops-engineer
```

### Bug Fix
```
1. Investigate  → @backend-engineer or @frontend-engineer
2. Fix          → Same engineer
3. Test         → @test-automator (regression test)
4. Review       → @security-auditor (if security-related)
5. Deploy       → @devops-engineer
```

### Security Audit
```
1. Code Review  → @security-auditor
2. Fix Issues   → @backend-engineer or @frontend-engineer
3. Verify       → @security-auditor
4. Test         → @test-automator
```

## 🎯 Best Practices

### ✅ Good Requests
```bash
# Specific and contextual
> "Design a multi-tenant SaaS architecture supporting 10,000 tenants 
   with database-per-tenant isolation strategy"

# Clear deliverables
> "Implement user authentication API with:
   - JWT tokens (15min expiry)
   - Refresh tokens (7d expiry)
   - Password reset flow
   - >80% test coverage"

# Appropriate scope
> "Review the authentication middleware for security vulnerabilities,
   focusing on JWT validation and session management"
```

### ❌ Avoid
```bash
# Too vague
> "Make it better"

# No context
> "Build a thing"

# Wrong agent
> "@ui-designer Write database migrations"
```

## 🛠️ Agent Selection Guide

**Architecture & Design:**
- System design → `@solution-architect`
- Database schema → `@database-architect`
- Security design → `@security-architect`
- UI/UX design → `@ui-designer`

**Implementation:**
- API endpoints → `@backend-engineer`
- UI components → `@frontend-engineer`
- Infrastructure → `@devops-engineer`

**Quality:**
- Test planning → `@qa-engineer`
- Automated testing → `@test-automator`
- Security review → `@security-auditor`

**Coordination:**
- Complex projects → `@agent-organizer`

## 📝 Example Requests

### Architecture
```bash
> "@solution-architect Design a notification system supporting 
   email, SMS, and push notifications with 99.9% uptime SLA"
```

### Database
```bash
> "@database-architect Design a schema for multi-tenant invoice 
   management with shared-schema row-level security"
```

### Backend
```bash
> "@backend-engineer Implement REST API for invoice CRUD with:
   - Pagination
   - Filtering by date/status
   - PDF generation
   - Tenant isolation"
```

### Frontend
```bash
> "@frontend-engineer Create an invoice list page with:
   - DataTable with sorting/filtering
   - Export to CSV
   - Bulk actions
   - Responsive design"
```

### Testing
```bash
> "@test-automator Write comprehensive tests for invoice API:
   - Unit tests for service layer
   - Integration tests for endpoints
   - E2E tests for invoice workflow"
```

### Security
```bash
> "@security-auditor Perform security audit on payment processing:
   - Review Stripe integration
   - Check PCI compliance
   - Verify encryption
   - Test for vulnerabilities"
```

### DevOps
```bash
> "@devops-engineer Set up CI/CD pipeline with:
   - GitHub Actions
   - Docker build
   - Kubernetes deployment
   - Automated testing
   - Staging → Production promotion"
```

### Multi-Agent
```bash
> "@agent-organizer Build a complete reports dashboard:
   - Revenue metrics (MRR, ARR, churn)
   - User activity charts
   - Tenant usage stats
   - Real-time updates
   - Date range filtering
   
   Include architecture, implementation, tests, and deployment."
```

## 🔍 Troubleshooting

### Agent Not Invoked
- Check `.md` file exists in `.claude/agents/`
- Verify YAML frontmatter `name:` matches
- Try explicit mention: `@agent-name`

### Wrong Agent Selected
- Be more specific in request
- Use explicit agent mention
- Update agent `description` field

### Need Custom Agent
- Copy existing agent as template
- Modify system prompt
- Update name and description
- Add to `.claude/agents/`

## 📚 File Structure

```
your-project/
├── .claude/
│   ├── agents/
│   │   ├── solution-architect.md
│   │   ├── database-architect.md
│   │   ├── security-architect.md
│   │   ├── ui-designer.md
│   │   ├── backend-engineer.md
│   │   ├── frontend-engineer.md
│   │   ├── devops-engineer.md
│   │   ├── qa-engineer.md
│   │   ├── test-automator.md
│   │   ├── security-auditor.md
│   │   └── agent-organizer.md
│   ├── hooks/
│   │   └── pre-commit.sh
│   └── settings.json
├── src/
└── ...
```

## 🎓 Learning Path

1. **Week 1**: Use individual agents for simple tasks
   - `@solution-architect` for design questions
   - `@backend-engineer` for implementation
   - `@test-automator` for tests

2. **Week 2**: Try sequential workflows
   - Design → Implement → Test

3. **Week 3**: Complex multi-agent workflows
   - Use `@agent-organizer` for features

4. **Week 4**: Create custom agents
   - Tailor agents to your tech stack
   - Add domain-specific knowledge

## 🔗 Resources

- **Full Guide**: `complete-claude-code-dev-team-guide.md`
- **Claude Code Docs**: https://code.claude.com/docs
- **Community Agents**: https://github.com/VoltAgent/awesome-claude-code-subagents
- **Examples**: https://subagents.cc

## 💬 Getting Help

If you need help:
1. Check the full guide for detailed examples
2. Review agent descriptions in `.claude/agents/`
3. Start with simple requests and iterate
4. Use `@agent-organizer` for complex tasks

---

**Pro Tip**: Start each development session by reviewing this quick reference to choose the right agent for your task!
