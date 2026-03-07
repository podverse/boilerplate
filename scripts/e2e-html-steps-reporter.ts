/**
 * Custom Playwright reporter that generates an HTML report with step screenshots
 * and their "Step description" attachments rendered together: each screenshot
 * is immediately followed by an expandable block with the full step description.
 * Use with PLAYWRIGHT_HTML_OUTPUT_DIR set and --reporter=scripts/e2e-html-steps-reporter.ts.
 */

import fs from 'fs';
import path from 'path';

import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

const STEP_DESCRIPTION_NAME = 'Step description';

interface ReporterOptions {
  outputFolder?: string;
}

interface CollectedRun {
  test: TestCase;
  result: TestResult;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default class HtmlStepsReporter implements Reporter {
  private outputDir: string = 'playwright-report';
  private rootDir: string = process.cwd();
  private runs: CollectedRun[] = [];

  constructor(options: ReporterOptions = {}) {
    const envDir = process.env.PLAYWRIGHT_HTML_OUTPUT_DIR;
    this.outputDir =
      options.outputFolder ??
      (typeof envDir === 'string' && envDir.trim() !== '' ? envDir.trim() : 'playwright-report');
  }

  printsToStdio(): boolean {
    return false;
  }

  onBegin(config: FullConfig, _suite: Suite): void {
    this.rootDir = config.rootDir;
    const attachmentsDir = path.join(this.outputDir, 'attachments');
    fs.mkdirSync(this.outputDir, { recursive: true });
    fs.mkdirSync(attachmentsDir, { recursive: true });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.runs.push({ test, result });
  }

  async onEnd(result: FullResult): Promise<void> {
    const attachmentsDir = path.join(this.outputDir, 'attachments');
    const parts: string[] = [];
    const isInterrupted = result.status === 'interrupted';

    const normalizedDir = this.outputDir.replace(/\\/g, '/');
    const reportTitle = normalizedDir.endsWith('/management-web')
      ? 'E2E Management Web Report'
      : normalizedDir.endsWith('/web')
        ? 'E2E Web Report'
        : 'E2E step report';

    const passed = this.runs.filter((r) => r.result.status === 'passed').length;
    const failed = this.runs.filter((r) => r.result.status === 'failed').length;
    const timedOut = this.runs.filter((r) => r.result.status === 'timedOut').length;
    const total = this.runs.length;

    parts.push(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(reportTitle)}</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 1rem; background: #1e1e1e; color: #d4d4d4; }
    h1 { font-size: 1.25rem; margin-bottom: 1rem; }
    .incomplete-banner { margin-bottom: 1.5rem; padding: 1rem; border: 1px solid #dcdcaa; border-radius: 6px; background: #3d3d2d; color: #dcdcaa; font-weight: 600; }
    h2.section-heading { font-size: 1.1rem; font-weight: 600; margin: 0 0 0.5rem; }
    .summary { margin-bottom: 1.5rem; padding: 1rem; border: 1px solid #444; border-radius: 6px; }
    .summary-stats { font-size: 0.875rem; margin-bottom: 0.75rem; }
    .summary-list { list-style: none; padding: 0; margin: 0; }
    .summary-list a { color: #9cdcfe; text-decoration: none; }
    .summary-list a:hover { text-decoration: underline; }
    .summary-list .prefix-pass { color: #4ec9b0; }
    .summary-list .prefix-error { color: #f48771; }
    .summary-list .prefix-timeout { color: #dcdcaa; }
    section.test { margin-bottom: 2rem; border: 1px solid #444; border-radius: 6px; padding: 1rem; scroll-margin-top: 0.5rem; }
    section.test h2 { font-size: 1rem; margin: 0 0 0.5rem; font-weight: 600; }
    .status { font-size: 0.875rem; margin-bottom: 0.75rem; }
    .status.passed { color: #4ec9b0; }
    .status.failed { color: #f48771; }
    .status.timedout { color: #dcdcaa; }
    .error { background: #2d2d2d; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; font-size: 0.875rem; color: #ce9178; white-space: pre-wrap; }
    .step-block { margin-bottom: 1.5rem; }
    .step-block img { max-width: 100%; height: auto; border: 1px solid #444; border-radius: 4px; display: block; }
    .step-block .step-description { margin-top: 0.5rem; }
    .step-block .step-description pre { margin: 0; padding: 0.75rem; background: #2d2d2d; border-radius: 4px; font-size: 0.8125rem; overflow-x: auto; white-space: pre-wrap; }
    .nav-buttons { position: fixed; bottom: 1rem; right: 1rem; display: flex; gap: 0.5rem; z-index: 10; }
    .nav-buttons button { padding: 0.5rem 0.75rem; font-size: 0.875rem; cursor: pointer; border: 1px solid #444; border-radius: 6px; background: #2d2d2d; color: #d4d4d4; }
    .nav-buttons button:hover { background: #3d3d3d; }
  </style>
</head>
<body>
  <h1>${escapeHtml(reportTitle)}</h1>
${isInterrupted ? '  <div class="incomplete-banner">Run aborted during execution; this report is incomplete.</div>\n' : ''}
  <h2 class="section-heading">Test summary</h2>
  <div class="summary">
    <div class="summary-stats">${total} test${total === 1 ? '' : 's'}: ${passed} passed, ${failed} failed${timedOut > 0 ? `, ${timedOut} timed out` : ''}</div>
    <ul class="summary-list">
`);
    for (let testIndex = 0; testIndex < this.runs.length; testIndex++) {
      const { test, result } = this.runs[testIndex];
      const status = result.status ?? 'unknown';
      const prefixClass =
        status === 'passed'
          ? 'prefix-pass'
          : status === 'timedOut'
            ? 'prefix-timeout'
            : 'prefix-error';
      const prefixText = status === 'passed' ? 'pass' : status === 'timedOut' ? 'timeout' : 'error';
      parts.push(`      <li><span class="${escapeHtml(prefixClass)}">${escapeHtml(prefixText)}:</span> <a href="#test-${testIndex}">${escapeHtml(test.title)}</a></li>
`);
    }
    parts.push(`    </ul>
  </div>
  <h2 class="section-heading">Screenshots and step descriptions</h2>
`);

    for (let testIndex = 0; testIndex < this.runs.length; testIndex++) {
      const { test, result } = this.runs[testIndex];
      const statusClass = result.status ?? 'unknown';
      parts.push(`  <section id="test-${testIndex}" class="test" data-test-index="${testIndex}" data-status="${escapeHtml(statusClass)}">
    <h2>${escapeHtml(test.title)}</h2>
    <div class="status ${escapeHtml(statusClass)}">${escapeHtml(statusClass)}</div>
`);
      if (result.error?.message) {
        parts.push(`    <div class="error">${escapeHtml(result.error.message)}</div>
`);
      }

      const attachments = result.attachments ?? [];
      for (let i = 0; i < attachments.length; i++) {
        const att = attachments[i];
        if (att.contentType === 'image/png' && att.path) {
          const srcPath = path.isAbsolute(att.path)
            ? att.path
            : path.resolve(this.rootDir, att.path);
          const ext = path.extname(att.path) || '.png';
          const destName = `test-${testIndex}-step-${i}${ext}`;
          const destPath = path.join(attachmentsDir, destName);
          try {
            fs.copyFileSync(srcPath, destPath);
          } catch {
            // If copy fails (e.g. path from worker), skip image
            continue;
          }
          const imgSrc = `attachments/${destName}`;
          parts.push(`    <div class="step-block">
    <img src="${escapeHtml(imgSrc)}" alt="Step screenshot">
`);
          // Next attachment may be "Step description" – emit it right after this image
          const next = attachments[i + 1];
          if (
            next &&
            next.name === STEP_DESCRIPTION_NAME &&
            (next.contentType === 'text/plain' || !next.contentType)
          ) {
            const body =
              next.body !== undefined
                ? typeof next.body === 'string'
                  ? next.body
                  : next.body.toString('utf-8')
                : '';
            parts.push(`    <div class="step-description">
    <pre>${escapeHtml(body)}</pre>
    </div>
`);
            i++; // consume the Step description attachment
          }
          parts.push(`    </div>
`);
        }
      }

      parts.push(`  </section>
`);
    }

    parts.push(`  <div class="nav-buttons" aria-label="Report navigation">
    <button type="button" id="nav-top">Top</button>
    <button type="button" id="nav-next-test">Next Test</button>
    <button type="button" id="nav-next-error">Next Error</button>
  </div>
  <script>
    (function () {
      var testSections = document.querySelectorAll('section.test');
      var errorSections = document.querySelectorAll('section.test[data-status="failed"], section.test[data-status="timedOut"]');
      function findCurrentIndex(elements) {
        var viewportTop = window.scrollY + 80;
        var currentIndex = -1;
        for (var j = 0; j < elements.length; j++) {
          var top = elements[j].getBoundingClientRect().top + window.scrollY;
          if (top <= viewportTop) currentIndex = j;
        }
        return currentIndex;
      }
      function findNext(elements) {
        if (elements.length === 0) return null;
        var currentIndex = findCurrentIndex(elements);
        var nextIndex = currentIndex + 1;
        if (nextIndex >= elements.length) nextIndex = 0;
        return elements[nextIndex];
      }
      function scrollTo(el) {
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      document.getElementById('nav-top').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
      document.getElementById('nav-next-test').addEventListener('click', function () { scrollTo(findNext(testSections)); });
      document.getElementById('nav-next-error').addEventListener('click', function () { scrollTo(findNext(errorSections)); });
    })();
  </script>
</body>
</html>
`);

    const indexPath = path.join(this.outputDir, 'index.html');
    fs.writeFileSync(indexPath, parts.join(''), 'utf-8');
  }
}
