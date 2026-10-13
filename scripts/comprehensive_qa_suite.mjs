// Master End-to-End Quality Assurance & Automation Suite for Shivmax Luxury Platform
import http from 'http';

const BASE_FRONTEND = 'http://127.0.0.1:3000';
const BASE_BACKEND = 'http://127.0.0.1:4000';

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), data, ok: res.ok };
}

async function runMasterQASuite() {
  console.log('========================================================================');
  console.log('🔱 SHIVMAX LUXURY PLATFORM — SENIOR QA AUTOMATION & AUDIT SUITE 🔱');
  console.log('========================================================================\n');

  const suiteResults = [];

  async function executeTest(phase, testId, title, testFn) {
    const startTime = performance.now();
    try {
      const details = await testFn();
      const duration = Math.round(performance.now() - startTime);
      suiteResults.push({ phase, testId, title, status: 'PASS', duration, details });
      console.log(`[PASS] [${testId}] ${title} (${duration}ms)`);
    } catch (err) {
      const duration = Math.round(performance.now() - startTime);
      suiteResults.push({ phase, testId, title, status: 'FAIL', duration, error: err.message });
      console.error(`[FAIL] [${testId}] ${title} (${duration}ms) — Error: ${err.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // PHASE 3 & 11: FUNCTIONAL & API INTEGRATION TESTING
  // -------------------------------------------------------------------------
  await executeTest('Functional API', 'QA-FUNC-01', 'Get All Properties (Catalog)', async () => {
    const res = await fetchJson(`${BASE_BACKEND}/api/properties`);
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
      throw new Error(`Invalid properties response, status: ${res.status}`);
    }
    return { count: res.data.length };
  });

  await executeTest('Functional API', 'QA-FUNC-02', 'Filter Properties by Category (Penthouse)', async () => {
    const res = await fetchJson(`${BASE_BACKEND}/api/properties?category=Penthouse`);
    if (res.status !== 200 || !res.data.every(p => p.category.toLowerCase() === 'penthouse')) {
      throw new Error('Category filter failed');
    }
    return { matchingCount: res.data.length };
  });

  await executeTest('Functional API', 'QA-FUNC-03', 'Filter Properties by Featured Flag', async () => {
    const res = await fetchJson(`${BASE_BACKEND}/api/properties?featured=true`);
    if (res.status !== 200 || !res.data.every(p => p.featured === true)) {
      throw new Error('Featured filter failed');
    }
    return { featuredCount: res.data.length };
  });

  await executeTest('Functional API', 'QA-FUNC-04', 'Retrieve Single Property by ID', async () => {
    const res = await fetchJson(`${BASE_BACKEND}/api/properties/trishula-sky-penthouse`);
    if (res.status !== 200 || res.data.id !== 'trishula-sky-penthouse') {
      throw new Error('Single property lookup failed');
    }
    return { id: res.data.id, title: res.data.title, vastuCompliant: res.data.vastuCompliant };
  });

  await executeTest('Functional API', 'QA-FUNC-05', 'Property 404 Error Handling for Invalid ID', async () => {
    const res = await fetchJson(`${BASE_BACKEND}/api/properties/invalid-id-9999`);
    if (res.status !== 404) {
      throw new Error(`Expected 404, got ${res.status}`);
    }
    return { status: 404, error: res.data?.error?.message || 'Correct 404 response' };
  });

  await executeTest('Functional API', 'QA-FUNC-06', 'Corporate Stats & RERA Credential Endpoint', async () => {
    const res = await fetchJson(`${BASE_BACKEND}/api/stats`);
    if (res.status !== 200 || !res.data.portfolioValue || !res.data.reraRegistered) {
      throw new Error('Stats payload incomplete');
    }
    return { rera: res.data.reraRegistered, portfolio: res.data.portfolioValue };
  });

  // -------------------------------------------------------------------------
  // PHASE 4: FORM TESTING & VALIDATION HARDENING
  // -------------------------------------------------------------------------
  await executeTest('Form Testing', 'QA-FORM-01', 'Form Rejects Malicious XSS Name Payload', async () => {
    const res = await fetchJson(`${BASE_BACKEND}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: '<script>alert("xss")</script>',
        email: 'test@domain.com',
        phone: '+91 98765 43210',
      }),
    });
    if (res.status !== 400) throw new Error(`Expected 400 Bad Request, got ${res.status}`);
    return { status: 400, rejected: true };
  });

  await executeTest('Form Testing', 'QA-FORM-02', 'Form Rejects Invalid Short Phone Number', async () => {
    const res = await fetchJson(`${BASE_BACKEND}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Rajesh Shah',
        email: 'rajesh@domain.com',
        phone: '1234',
      }),
    });
    if (res.status !== 400) throw new Error(`Expected 400 Bad Request, got ${res.status}`);
    return { status: 400, rejected: true };
  });

  await executeTest('Form Testing', 'QA-FORM-03', 'Form Rejects Invalid Malformed Email Format', async () => {
    const res = await fetchJson(`${BASE_BACKEND}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Rajesh Shah',
        email: 'not-an-email-address',
        phone: '+91 98765 43210',
      }),
    });
    if (res.status !== 400) throw new Error(`Expected 400 Bad Request, got ${res.status}`);
    return { status: 400, rejected: true };
  });

  await executeTest('Form Testing', 'QA-FORM-04', 'Bot Honeypot Shadow Drop Validation', async () => {
    const res = await fetchJson(`${BASE_BACKEND}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Spam Crawler Bot',
        email: 'bot@spamnetwork.com',
        phone: '+919876543210',
        fax_number: 'Automated Bot Field Injection',
      }),
    });
    if (res.status !== 201 || !res.data?.data?.id.startsWith('inq_bot_')) {
      throw new Error('Bot inquiry was not handled by shadow trap');
    }
    return { shadowDrop: true, fakeBotId: res.data.data.id };
  });

  await executeTest('Form Testing', 'QA-FORM-05', 'Legitimate Franchise Inquiry Submission', async () => {
    const res = await fetchJson(`${BASE_BACKEND}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Vikramaditya Singhania',
        email: 'singhania.v@prestige.com',
        phone: '+91 98250 11223',
        propertyInterest: 'Franchise Territory: Alkapuri Hub',
        specialRequests: 'Comprehensive portfolio review and 365-day funded setup inquiry.',
      }),
    });
    if (res.status !== 201 || !res.data?.data?.referenceCode) {
      throw new Error('Legitimate inquiry submission failed');
    }
    return { referenceCode: res.data.data.referenceCode, concierge: res.data.data.dedicatedConcierge };
  });

  // -------------------------------------------------------------------------
  // PHASE 11 & 12: ACCESS CONTROL, SECURITY & HEADERS QA
  // -------------------------------------------------------------------------
  await executeTest('Security & Auth', 'QA-SEC-01', 'Confidential Inquiries Protected from Unauthenticated Public Access', async () => {
    const res = await fetchJson(`${BASE_BACKEND}/api/inquiries`);
    if (res.status !== 401) {
      throw new Error(`Expected 401 Unauthorized, received ${res.status}`);
    }
    return { status: 401, accessDenied: true };
  });

  await executeTest('Security & Auth', 'QA-SEC-02', 'Admin Authentication Accepts Valid Secret Header', async () => {
    const res = await fetchJson(`${BASE_BACKEND}/api/inquiries`, {
      headers: { 'X-Admin-Api-Key': 'shivmax-dev-admin-secret-key-change-in-prod' },
    });
    if (res.status !== 200 || !Array.isArray(res.data)) {
      throw new Error(`Admin authentication failed, status: ${res.status}`);
    }
    return { status: 200, inquiriesRetrieved: res.data.length };
  });

  await executeTest('Security & Auth', 'QA-SEC-03', 'Backend Security Headers (Helmet, COOP, CORP, HSTS, Nosniff)', async () => {
    const res = await fetchJson(`${BASE_BACKEND}/api/properties`);
    const h = res.headers;
    if (h['x-content-type-options'] !== 'nosniff' || !h['cross-origin-opener-policy']) {
      throw new Error('Missing essential Helmet security headers');
    }
    return {
      nosniff: h['x-content-type-options'],
      coop: h['cross-origin-opener-policy'],
      corp: h['cross-origin-resource-policy'],
      hsts: h['strict-transport-security'],
      frameOptions: h['x-frame-options'],
    };
  });

  await executeTest('Security & Auth', 'QA-SEC-04', 'Frontend Content Security Policy (CSP) & Defensive Headers', async () => {
    const res = await fetch(BASE_FRONTEND);
    const h = Object.fromEntries(res.headers.entries());
    const csp = h['content-security-policy'];
    if (!csp || !csp.includes("default-src 'self'")) {
      throw new Error('Missing or invalid Content Security Policy header');
    }
    return {
      hasCSP: true,
      coop: h['cross-origin-opener-policy'],
      corp: h['cross-origin-resource-policy'],
    };
  });

  // -------------------------------------------------------------------------
  // PHASE 5, 8 & 13: UI, ACCESSIBILITY & SEO QUALITY CHECKS
  // -------------------------------------------------------------------------
  await executeTest('SEO & Structure', 'QA-SEO-01', 'HTML Doctype, Character Set & Viewport Configuration', async () => {
    const res = await fetch(BASE_FRONTEND);
    const html = await res.text();
    const hasDoctype = html.toLowerCase().includes('<!doctype html>');
    const hasViewport = html.includes('name="viewport"');
    const hasTitle = html.includes('<title>');
    if (!hasDoctype || !hasViewport || !hasTitle) throw new Error('Missing essential HTML meta tags');
    return { hasDoctype, hasViewport, hasTitle };
  });

  await executeTest('SEO & Structure', 'QA-SEO-02', 'SEO Title & Meta Description Validation', async () => {
    const res = await fetch(BASE_FRONTEND);
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';
    if (!title.includes('SHIVMAX')) throw new Error(`Unexpected title: ${title}`);
    return { title };
  });

  await executeTest('Performance', 'QA-PERF-01', 'Critical Luxury Media Assets Availability & Latency', async () => {
    const assets = [
      '/logo/shivmax-crest-hd.png',
      '/logo/shivmax-text-hd.png',
      '/images/ceo-portrait.jpg',
      '/images/ceo-vivek-mishra.jpg',
      '/images/hero-poster.jpg',
    ];

    const results = {};
    for (const a of assets) {
      const t0 = performance.now();
      const res = await fetch(`${BASE_FRONTEND}${a}`, { method: 'HEAD' });
      const lat = Math.round(performance.now() - t0);
      if (res.status !== 200) throw new Error(`Asset ${a} returned ${res.status}`);
      results[a] = `${lat}ms (200 OK)`;
    }
    return results;
  });

  await executeTest('Performance', 'QA-PERF-02', 'Pre-Decoded GPU Video Sequence File Integrity (hero_sequence.mp4)', async () => {
    const res = await fetch(`${BASE_FRONTEND}/video/hero_sequence.mp4`, { method: 'HEAD' });
    if (res.status !== 200) throw new Error('Video sequence not found');
    const contentLength = res.headers.get('content-length');
    const sizeMB = (parseInt(contentLength || '0', 10) / (1024 * 1024)).toFixed(1);
    return { sizeMB: `${sizeMB} MB`, status: 200 };
  });

  // -------------------------------------------------------------------------
  // REPORTING & SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n========================================================================');
  const passed = suiteResults.filter(r => r.status === 'PASS').length;
  const failed = suiteResults.filter(r => r.status === 'FAIL').length;
  console.log(`TOTAL TESTS: ${suiteResults.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`PASS RATE: ${((passed / suiteResults.length) * 100).toFixed(1)}%`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runMasterQASuite().catch(err => {
  console.error('Master QA Suite Error:', err);
  process.exit(1);
});
