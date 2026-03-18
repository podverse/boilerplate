# 08 – Performance review

## Scope

Review the front end and back end for performance optimizations. Document concrete findings and
prioritize them; implement low-effort, high-impact fixes or create tickets for larger work.

## Steps

### 1. Front-end review

- **Bundle size**: Run bundle analysis for both `apps/web` and `apps/management-web` (separate
  Next.js apps) so each bundle can be optimized independently. Use the Next.js (or app) build
  and a bundle analyzer (e.g. `@next/bundle-analyzer` or similar). Identify large dependencies
  or duplicate chunks; consider code-splitting, dynamic imports for heavy components, or
  replacing heavy libs with lighter alternatives.
- **Lazy loading**: Ensure routes and heavy components (e.g. modals, charts, admin-only sections)
  are lazy-loaded where appropriate (e.g. `next/dynamic` or React.lazy). Avoid loading
  management-web-only code in the main web app if they are separate bundles.
- **Memoization**: Review list and detail pages (e.g. bucket list, bucket detail) for expensive
  re-renders; add React.memo or useMemo/useCallback where a clear win and no correctness tradeoff.
- **Images and assets**: Ensure images use appropriate format and size; add responsive or
  lazy-loading where applicable. Check that static assets are cached appropriately (headers or
  build output).

### 2. Back-end review

- **N+1 queries**: Audit ORM usage in API and management-api (e.g. list endpoints that load
  relations in a loop). Use relations, QueryBuilder, or DataLoader-style batching to avoid N+1.
- **Response payload size**: Ensure list endpoints don’t return full entities when a summary
  suffices; trim or paginate large arrays. Check that DTOs/serializers don’t include unnecessary
  data.
- **Indexing**: Review database indexes on columns used in WHERE, ORDER BY, and JOINs; add
  indexes where queries are slow and tables are large. Prefer existing migration patterns.
- **Caching**: Consider caching headers for public or rarely-changing responses; consider
  in-memory or Redis caching for expensive reads if the stack supports it. Document decisions.

### 3. Document findings and prioritize

- Produce a short list of findings: issue, location (file or area), suggested fix, and rough
  effort (low/medium/high). Prioritize by impact and effort.
- Implement all “low effort, high impact” items that are clearly safe (e.g. adding an index,
  trimming a payload, one lazy import). For larger items, create tickets or add them to a
  backlog with the finding and recommendation.

### 4. Verify

- Re-run bundle analysis or Lighthouse (if used) after changes; note improvements.
- Run the test suite and any performance-related tests; ensure no regressions.

## Key files

- Next.js config (web, management-web), app router and heavy pages
- API and management-api controllers and services
- ORM entities, repositories, and query usage
- Any existing performance or bundle docs

## Verification

- Documented list of performance findings and priorities.
- Low-effort fixes applied where agreed; behavior unchanged.
- Tests pass; bundle size or key metrics improved or unchanged.
