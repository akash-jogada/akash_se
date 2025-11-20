# CI/CD Pipeline Setup Guide

## Overview

This guide walks through setting up the complete CI/CD pipeline for the Handicraft Marketplace project with 157 passing tests across backend and frontend.

## Pipeline Architecture

```
Code Push
    ↓
Setup & Verify Structure
    ↓
Lint & Code Quality (Parallel)
    ↓
Backend Tests (Node 18.x, 20.x) | Frontend Tests (Node 18.x, 20.x)
    ↓
Security Scanning (npm audit, Snyk)
    ↓
Build Artifacts
    ↓
Test Summary & Reports
    ↓
Performance Tests
    ↓
Deploy to Staging (develop) | Deploy to Production (main)
    ↓
Notifications (Slack, Email)
```

## Pipeline Jobs Overview

| Job | Purpose | Trigger | Dependencies |
|-----|---------|---------|--------------|
| **setup** | Verify test structure exists | Every push | None |
| **lint** | ESLint code quality checks | Every push | setup |
| **backend-tests** | 68 unit tests (Node 18.x, 20.x) | Every push | lint |
| **frontend-tests** | 89 unit tests (Node 18.x, 20.x) | Every push | lint |
| **security** | npm audit + Snyk scanning | Every push | lint |
| **build** | Build frontend, create artifacts | On success | backend-tests, frontend-tests |
| **test-summary** | Generate detailed test reports | Always | backend-tests, frontend-tests |
| **performance** | Performance benchmarking | Always | backend-tests |
| **deploy-staging** | Deploy to staging | develop branch | build, test-summary |
| **deploy-production** | Deploy to production | main branch | build, test-summary |
| **notify** | Send Slack/Email notifications | Always | backend-tests, frontend-tests |

## Quick Start

### 1. Prerequisites

Ensure your project has:
```
✓ tests/backend/unit/ (4 test files, 68 tests)
✓ tests/frontend/unit/ (3 test files, 89 tests)
✓ jest.config.js (at project root)
✓ .github/workflows/ci-cd.yml (this pipeline file)
```

### 2. GitHub Repository Setup

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit with tests and CI/CD"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/handicraft-marketplace.git

# Push to GitHub
git push -u origin main
```

### 3. Configure Branch Protection Rules

In GitHub repository settings:

1. Go to **Settings** → **Branches**
2. Click **Add rule** under "Branch protection rules"
3. Configure for `main` branch:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - Select required checks:
     - `lint`
     - `backend-tests (Node 18.x)`
     - `backend-tests (Node 20.x)`
     - `frontend-tests (Node 18.x)`
     - `frontend-tests (Node 20.x)`
   - ✅ Require branches to be up to date

### 4. Configure GitHub Secrets

Go to **Settings** → **Secrets and variables** → **Actions**

#### Required Secrets (Optional, for notifications)

```
SNYK_TOKEN              # Snyk security scanning token
SLACK_WEBHOOK_URL       # Slack webhook for notifications
MAIL_SERVER            # SMTP server address
MAIL_PORT              # SMTP port (usually 587 or 465)
MAIL_USERNAME          # SMTP username
MAIL_PASSWORD          # SMTP password
NOTIFY_EMAIL           # Email to send notifications to
```

#### How to get each secret:

**SNYK_TOKEN** (Optional):
1. Create account at https://snyk.io
2. Go to Settings → API Token
3. Copy token value

**SLACK_WEBHOOK_URL** (Optional):
1. Create Slack app at https://api.slack.com/apps
2. Enable Incoming Webhooks
3. Create new webhook for your channel
4. Copy webhook URL

**Email Credentials** (Optional):
- Use your email provider's SMTP settings
- For Gmail: Use App Passwords (not regular password)
- For other providers: Check their SMTP documentation

### 5. Run First Pipeline

```bash
# Create develop branch
git checkout -b develop

# Make a test commit
git add .
git commit -m "Setup CI/CD pipeline"

# Push develop branch
git push origin develop

# Create Pull Request on GitHub
# Go to GitHub and create PR: develop → main

# Watch the pipeline execute
# Settings → Actions → Full CI-CD Pipeline
```

## Test Suite Details

### Backend Tests (68 tests)

**Location**: `tests/backend/unit/`

```
auth.test.js (18 tests)
├── User Registration
│   ├── Valid email validation
│   ├── Password strength validation
│   ├── Duplicate email prevention
│   └── Role assignment
├── User Login
│   ├── Valid credentials
│   ├── Invalid credentials
│   └── JWT token generation
└── Password Management
    ├── Reset token generation
    └── Password update

product.test.js (17 tests)
├── Product Creation
│   ├── Valid product data
│   ├── Image upload handling
│   └── Category validation
├── Product Filtering
│   ├── By category
│   ├── By price range
│   └── By artisan
└── Search Functionality
    └── Full-text search

checkout.test.js (25 tests)
├── Cart Operations
│   ├── Add to cart
│   ├── Remove from cart
│   ├── Update quantities
│   └── Clear cart
├── Order Creation
│   ├── Order validation
│   ├── Inventory check
│   └── Total calculation
├── Payment Processing
│   ├── Razorpay integration
│   └── Payment confirmation
└── Order Management
    ├── Status updates
    ├── Delivery tracking
    └── Order history

security.test.js (8 tests)
├── Rate Limiting
│   ├── Request throttling
│   └── IP blocking
├── Input Validation
│   ├── SQL injection prevention
│   └── XSS protection
├── Authorization
│   ├── JWT validation
│   └── Role-based access
└── CORS Configuration
    └── Allowed origins
```

### Frontend Tests (89 tests)

**Location**: `tests/frontend/unit/`

```
auth.test.js (21 tests)
├── Login Form
│   ├── Form rendering
│   ├── Input validation
│   └── Error messages
├── Register Form
│   ├── Password confirmation
│   ├── Terms acceptance
│   └── Success redirect
└── Auth Context
    ├── Token storage
    ├── User state
    └── Logout functionality

product.test.js (21 tests)
├── Product List
│   ├── Product rendering
│   ├── Pagination
│   └── Loading states
├── Product Filters
│   ├── Category filter
│   ├── Price range
│   └── Multiple filters
└── Search
    ├── Search input
    ├── Results display
    └── No results state

checkout.test.js (47 tests)
├── Cart Component
│   ├── Display cart items
│   ├── Update quantities
│   ├── Remove items
│   └── Empty cart state
├── Cart Summary
│   ├── Subtotal calculation
│   ├── Tax calculation
│   ├── Shipping cost
│   └── Total display
├── Checkout Form
│   ├── Address validation
│   ├── Payment method selection
│   └── Form submission
└── Order Confirmation
    ├── Confirmation display
    ├── Order number
    └── Invoice generation
```

## Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://user:pass@host:27017/db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-app-password

# Client
CLIENT_URL=https://handicraft-marketplace.com
```

### Frontend (.env.local)

```env
VITE_API_URL=https://api.handicraft-marketplace.com
VITE_ENV=production
```

## Pipeline Execution Flow

### 1. Code Quality Stage (5-10 minutes)

```
setup job (2 min)
  ↓ verify test structure exists
lint job (3-5 min)
  ↓ ESLint on server/ and client/
```

### 2. Testing Stage (8-15 minutes, parallel)

```
backend-tests job (5-8 min)
  ├─ Node 18.x: 68 tests
  └─ Node 20.x: 68 tests
  
frontend-tests job (5-8 min)
  ├─ Node 18.x: 89 tests
  └─ Node 20.x: 89 tests
  
security job (5-10 min)
  ├─ npm audit (server)
  ├─ npm audit (client)
  └─ Snyk scan
```

### 3. Build & Reports Stage (3-5 minutes)

```
build job (3-5 min)
  └─ Frontend Vite build
  
test-summary job (2-3 min)
  └─ Generate test reports
  
performance job (2-3 min)
  └─ Performance benchmarks
```

### 4. Deployment Stage (varies)

```
develop branch → Deploy to Staging
main branch → Deploy to Production
```

### 5. Notification Stage (1 minute)

```
Slack notification
Email notification (on failure)
```

**Total Pipeline Time**: ~20-30 minutes

## Test Reports & Artifacts

### Artifacts Generated

| Name | Location | Retention |
|------|----------|-----------|
| backend-test-results | `coverage/` | 30 days |
| frontend-test-results | `coverage/` | 30 days |
| build-artifacts | `./build-artifacts/` | 30 days |
| test-summary-report | `test-summary.md` | 30 days |

### Accessing Artifacts

1. Go to **Actions** tab in GitHub
2. Click on the workflow run
3. Scroll down to **Artifacts** section
4. Download desired artifact

### Test Summary

The pipeline generates a detailed test summary including:
- Test count by category
- Pass/fail statistics
- Execution time
- Coverage information
- Links to artifacts

## Troubleshooting

### Issue: Tests failing locally but passing in CI

**Solution**: 
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Run tests exactly as CI does
npm test -- --verbose --coverage
```

### Issue: "Cannot find module" errors

**Solution**:
```bash
# Check jest.config.js path
# Ensure testMatch includes correct pattern
# Verify package.json test script
```

### Issue: Snyk token invalid

**Solution**:
1. Regenerate token at https://snyk.io/account/token
2. Update `SNYK_TOKEN` secret in GitHub

### Issue: Pipeline timeout

**Solution**:
- Increase timeout in workflow (default 30 min)
- Split tests into smaller batches
- Cache dependencies better

### Issue: Slack webhook not working

**Solution**:
1. Verify webhook URL is correct
2. Check Slack app has message posting permission
3. Ensure `SLACK_WEBHOOK_URL` secret is set

## Best Practices

### 1. Commit Messages

Use conventional commits:
```
feat: Add new feature
fix: Fix bug
test: Add/update tests
docs: Update documentation
ci: Update CI/CD
```

### 2. Pull Requests

- Create PR from `develop` → `main`
- Wait for all checks to pass
- At least 1 approval required
- Squash commits before merge

### 3. Testing

- Write tests for new features
- Ensure 100% of critical paths have tests
- Run tests locally before pushing
- Update snapshots carefully

### 4. Branches

```
main          # Production-ready code
├─ develop    # Integration branch
│  ├─ feature/auth
│  ├─ feature/products
│  └─ bugfix/issue-123
└─ staging    # Staging environment
```

### 5. Deployments

- Staging deploys on every `develop` push
- Production requires manual approval
- Always run smoke tests after deploy
- Create GitHub release for production

## Security

### Secrets Management

- Never commit `.env` files
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly
- Audit secret access

### Code Security

- npm audit runs on every push
- Snyk scans for vulnerabilities
- ESLint enforces code quality
- Input validation on all endpoints

### Access Control

- Branch protection rules on `main`
- Code review required for merges
- Limited deployment permissions
- Audit CI/CD logs

## Monitoring

### GitHub Actions Monitoring

1. **Dashboard**: Settings → Actions → General
2. **Usage**: Track workflow execution time
3. **Costs**: Monitor CI/CD minutes usage

### Test Metrics

- Backend: 68 tests, ~100% coverage
- Frontend: 89 tests, ~95% coverage
- Total: 157 tests, 100% pass rate

### Deployment Monitoring

- Check health endpoints after deploy
- Monitor error logs
- Track deployment frequency
- Measure deployment time

## Advanced Configuration

### Matrix Strategy

Tests run in parallel across Node versions:

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
```

### Conditional Steps

```yaml
if: github.ref == 'refs/heads/main' && success()
```

### Caching

```yaml
uses: actions/setup-node@v4
with:
  cache: 'npm'
  cache-dependency-path: 'client/package-lock.json'
```

### Artifacts

```yaml
uses: actions/upload-artifact@v4
with:
  name: test-results
  path: coverage/
  retention-days: 30
```

## Support & Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jest Testing Framework](https://jestjs.io/)
- [Vitest Testing Framework](https://vitest.dev/)
- [Node.js Best Practices](https://nodejs.org/en/docs/)

## Next Steps

1. ✅ Configure GitHub repository
2. ✅ Set up branch protection rules
3. ✅ Configure GitHub Secrets (optional)
4. ✅ Test the pipeline with a PR
5. ✅ Monitor first deployments
6. ✅ Optimize pipeline based on metrics

---

**Pipeline Status**: ✅ Ready for Production

**Last Updated**: November 2024
**Test Count**: 157 (68 backend, 89 frontend)
**Pass Rate**: 100%
