import './styles.css';

let inputMode = 'upload';
let currentResults = [];
let currentQueryText = '';
let currentQueryName = '';
let currentSimilarityHeatMap = null;
let currentInfluenceFindings = [];
let influencePage = 1;
const INFLUENCE_PAGE_SIZE = 15;

/* ── Icons ──────────────────────────────────────────────────────── */
const ICON = {
  analyze: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="8"/><path d="M10 6v4l3 3"/></svg>`,
  arrow: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 10h12M12 6l4 4-4 4"/></svg>`,
  file: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V8l-4-6z"/><path d="M12 2v6h6"/></svg>`,
  logo: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  diamond: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>`,
  grammar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  detect: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>`,
  similarity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="8" height="18" rx="2"/><rect x="14" y="3" width="8" height="18" rx="2"/></svg>`,
};

/* ── Render ─────────────────────────────────────────────────────── */
function renderApp() {
  const app = document.querySelector('#app');
  if (!app) return;

  app.innerHTML = `
    <div class="app-wrapper">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-logo">${ICON.logo}</div>
        <nav class="sidebar-nav">
          <button class="sidebar-item active" id="sb-upload" onclick="switchSidebarMode('upload')" title="Upload Documents">
            ${ICON.file}
            <span>Files</span>
          </button>
          <button class="sidebar-item" id="sb-type" onclick="switchSidebarMode('type')" title="Type Text">
            ${ICON.plus}
            <span>Text</span>
          </button>
          <button class="sidebar-item" id="sb-professor" onclick="switchSidebarMode('professor')" title="Professor Batch">
            ${ICON.similarity}
            <span>Batch</span>
          </button>
        </nav>
        <div class="sidebar-avatar" style="margin-top:auto;cursor:pointer;color:var(--muted);">${ICON.user}</div>
      </aside>

      <div class="app-shell">
        <!-- Top bar -->
        <header class="top-bar">
          <div class="top-brand">
            <div class="top-logo">${ICON.logo}</div>
            <div class="top-text">
              <div class="top-title">DocuCheck</div>
              <div class="top-subtitle">
                <span>A Machine Learning Project Foundation</span>
                <span class="sep">•</span>
                <span>Made by PokeTech Marketing</span>
              </div>
            </div>
          </div>
        </header>

        <main class="page-shell">
          <!-- Hero -->
          <section class="hero" style="margin-top:10px;">
            <h1>Classmate Work<br>Comparison &amp; Feedback</h1>
            <p class="hero-desc">Compare one original classwork submission against one or more classmate submissions, review similarity patterns, and generate helpful feedback using TF-IDF and bag-of-words cosine similarity.</p>
          </section>

          <!-- Input panel -->
          <section class="panel" id="input-panel">
            <div class="panel-title" id="panel-title">Input Options</div>
            <p class="panel-sub" id="panel-desc">Select a mode from the sidebar to upload files, type text, or run a professor batch analysis.</p>

            <form id="main-form" autocomplete="off">

              <!-- Upload panel -->
              <div id="panel-upload" class="form-grid">
                <div class="field-group">
                  <label class="field-label" for="query-file">Original Document</label>
                  <div class="file-row">
                    <input id="query-file" name="query_file" type="file" accept=".txt,.pdf,.docx" />
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label" for="documents">Test Document(s)</label>
                  <div class="file-row">
                    <input id="documents" name="documents" type="file" accept=".txt,.pdf,.docx" multiple />
                  </div>
                </div>
              </div>

              <!-- Type panel -->
              <div id="panel-type" class="hidden">
                <div class="form-grid">
                  <div class="field-group">
                    <label class="field-label" for="query-name">Original Name</label>
                    <input class="field-input" id="query-name" name="query_name" type="text" placeholder="typed_original.txt" />
                  </div>
                  <div class="field-group">
                    <label class="field-label" for="test-name">Test Name</label>
                    <input class="field-input" id="test-name" name="test_name" type="text" placeholder="typed_test.txt" />
                  </div>
                  <div class="field-group full">
                    <label class="field-label" for="query-text">Original Text</label>
                    <textarea class="field-input" id="query-text" name="query_text" rows="6" placeholder="Paste or type the original document text here…"></textarea>
                  </div>
                  <div class="field-group full">
                    <label class="field-label" for="test-text">Test Text</label>
                    <textarea class="field-input" id="test-text" name="test_text" rows="6" placeholder="Paste or type the test document text here…"></textarea>
                  </div>
                </div>
              </div>
              <!-- Professor panel -->
              <div id="panel-professor" class="hidden">
                <div class="field-group" style="max-width:520px;">
                  <label class="field-label" for="batch-documents">Student Submissions</label>
                  <div class="file-row">
                    <input id="batch-documents" name="batch_documents" type="file" accept=".txt,.pdf,.docx" multiple />
                  </div>
                </div>

                <div style="margin-top:22px;">
                  <div class="batch-row">
                    <div>
                      <div class="panel-title" style="font-size:0.95rem;">Submission Set</div>
                      <p style="font-size:0.84rem;font-weight:300;color:var(--muted);margin-top:3px;">Add all student files here. Results will appear below after running.</p>
                    </div>
                    <span class="batch-badge" id="batch-count">0 files</span>
                  </div>
                  <div class="batch-grid" id="batch-grid"></div>
                </div>
              </div>

              <!-- Action row -->
              <div class="action-row">
                <button id="submit-btn" class="btn-primary" type="submit">
                  ${ICON.analyze} Analyze Documents
                </button>
                <button id="prof-submit-btn" class="btn-primary hidden" type="submit">
                  ${ICON.analyze} Run Batch Analysis
                </button>
              </div>
            </form>

            <p id="status-msg" class="status-msg">Ready for analysis.</p>

            <!-- Professor results (inline) -->
            <div id="prof-results" class="hidden" style="margin-top:32px;">
              <div style="height:1px;background:var(--line);margin-bottom:28px;"></div>

              <div class="prof-tabs" role="tablist">
                <button class="ptab active" data-ptab="overview">Overview</button>
                <button class="ptab" data-ptab="ranking">Class Ranking</button>
                <button class="ptab" data-ptab="similarity">Similarity Count</button>
                <button class="ptab" data-ptab="heatmap">Heat Map</button>
                <button class="ptab" data-ptab="influence">Influence Detection</button>
              </div>

              <!-- Overview -->
              <div id="ptab-overview" class="ptab-panel active">
                <p id="prof-overview-txt" class="empty-state"></p>
              </div>

          <!-- Ranking -->
          <div id="ptab-ranking" class="ptab-panel">
            <div class="tbl-wrap">
              <table>
                <thead><tr>
                  <th>#</th><th>Document</th><th>Writing Quality</th>
                  <th>TF-IDF Uniqueness</th><th>TF-IDF Score</th>
                  <th>BOW Score</th><th>Word Count</th><th>Feedback</th>
                </tr></thead>
                <tbody id="ranking-body"></tbody>
              </table>
            </div>
          </div>

          <!-- Similarity count -->
          <div id="ptab-similarity" class="ptab-panel">
            <div class="filter-row">
              <div class="filter-group">
                <span class="filter-lbl">Filter</span>
                <select class="filter-sel" id="sim-filter">
                  <option value="all">All</option>
                  <option value="tfidf">Only TF-IDF</option>
                  <option value="bow">Only BOW</option>
                </select>
              </div>
              <div class="filter-group">
                <span class="filter-lbl">Threshold: <strong id="sim-thresh-val">0.50</strong></span>
                <input type="range" id="sim-thresh" min="0" max="1" step="0.01" value="0.50" style="width:160px;" />
              </div>
            </div>
            <div class="sim-grid" id="sim-count-grid"></div>
          </div>

          <!-- Heat map -->
          <div id="ptab-heatmap" class="ptab-panel">
            <p id="heat-summary-txt" class="panel-sub" style="margin-bottom:14px;"></p>
            <div class="heat-matrix tbl-wrap">
              <table style="min-width:auto;">
                <thead id="heat-head"></thead>
                <tbody id="heat-body"></tbody>
              </table>
            </div>
          </div>

          <!-- Influence -->
          <div id="ptab-influence" class="ptab-panel">
            <div class="filter-row">
              <div class="filter-group">
                <span class="filter-lbl">Influence Score</span>
                <select class="filter-sel" id="inf-filter">
                  <option value="all">All Scores</option>
                  <option value="0-20">0–20%</option>
                  <option value="21-39">21–39%</option>
                  <option value="40-59">40–59%</option>
                  <option value="60-79">60–79%</option>
                  <option value="80-100">80–100%</option>
                </select>
              </div>
            </div>
            <div class="tbl-wrap">
              <table>
                <thead><tr>
                  <th>#</th><th>Doc A</th><th>Doc B</th><th>Flag</th><th>Decision</th>
                  <th>Score</th><th>TF-IDF</th><th>BOW</th><th>Explanation</th>
                </tr></thead>
                <tbody id="inf-body"></tbody>
              </table>
            </div>
            <div class="pag-bar">
              <p class="pag-info" id="inf-pag-txt">Showing 0–0 of 0 pairs</p>
              <div class="pag-btns">
                <button class="pag-btn" id="inf-prev">← Prev</button>
                <span class="pag-info" id="inf-page-ind">Page 1 of 1</span>
                <button class="pag-btn" id="inf-next">Next →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Analysis results ── -->
      <div id="results-section" class="results-stack hidden">

        <!-- Summary -->
        <section class="panel">
          <div class="panel-title">Analysis Summary</div>
          <p class="panel-sub" id="summary-sub">Overview of the current run.</p>
          <div class="summary-pills" id="summary-pills"></div>
        </section>

        <!-- Ranked docs -->
        <section class="panel">
          <div class="panel-title">Compared Documents</div>
          <p class="panel-sub">Click a document to see detailed analysis below.</p>
          <div class="copycat-list" id="copycat-list"></div>
        </section>

        <!-- Gauge -->
        <section class="panel" id="gauge-panel">
          <div class="panel-title" style="margin-bottom:22px;">Copycat Gauge</div>
          <div id="gauge-content"></div>
        </section>

        <!-- Explanation -->
        <section class="panel">
          <div class="panel-title">Why It Looks Like a Paraphrase</div>
          <p class="panel-sub">Evidence from the selected document pair.</p>
          <div class="explain-grid" id="explain-content"></div>
        </section>

        <!-- Recommendation -->
        <section class="panel">
          <div class="panel-title" style="margin-bottom:16px;">Recommendation</div>
          <div class="reco-block" id="reco-content"></div>
        </section>

        <!-- Highlighter -->
        <section class="panel">
          <div class="hl-top">
            <div>
              <div class="panel-title">Word Highlighter</div>
              <p class="panel-sub" style="margin-bottom:0;">Every shared word colored by TF-IDF significance.</p>
            </div>
            <span class="word-badge" id="word-badge">0 words shared</span>
          </div>
          <div class="hl-legend">
            <div class="hl-li"><span class="hl-sw" style="background:rgba(99,102,241,0.18);border:1.5px solid rgba(99,102,241,0.5);"></span>Low significance</div>
            <div class="hl-li"><span class="hl-sw" style="background:rgba(234,88,12,0.18);border:1.5px solid rgba(234,88,12,0.55);"></span>Medium significance</div>
            <div class="hl-li"><span class="hl-sw" style="background:rgba(220,38,38,0.16);border:1.5px solid rgba(220,38,38,0.55);"></span>High significance</div>
          </div>
          <div class="hl-cols">
            <div>
              <div class="hl-col-lbl" id="hl-lbl-a">Original Document</div>
              <div class="hl-box" id="hl-a"></div>
            </div>
            <div>
              <div class="hl-col-lbl" id="hl-lbl-b">Test Document</div>
              <div class="hl-box" id="hl-b"></div>
            </div>
          </div>
        </section>

      </div><!-- /results-section -->
    </main>
  `;

  wireEvents();
  setMode('upload');
}

/* ── Sidebar Logic ─────────────────────────────────────────────── */

window.switchSidebarMode = function (mode) {
  if (mode === 'upload' || mode === 'type' || mode === 'professor') {
    setMode(mode);
  }

  document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('sb-' + mode);
  if (target) target.classList.add('active');
};

/* ── Wire events ────────────────────────────────────────────────── */
function wireEvents() {
  /* Prof tabs */
  document.querySelectorAll('.ptab').forEach(btn => {
    btn.addEventListener('click', () => switchProfTab(btn.dataset.ptab));
  });

  /* Batch file preview */
  document.getElementById('batch-documents').addEventListener('change', renderBatchPreview);

  /* Sim count controls */
  document.getElementById('sim-filter').addEventListener('change', () => renderSimCount(currentSimilarityHeatMap));
  document.getElementById('sim-thresh').addEventListener('input', e => {
    document.getElementById('sim-thresh-val').textContent = Number(e.target.value).toFixed(2);
    renderSimCount(currentSimilarityHeatMap);
  });

  /* Influence filter + pagination */
  document.getElementById('inf-filter').addEventListener('change', () => { influencePage = 1; renderInfluence(); });
  document.getElementById('inf-prev').addEventListener('click', () => { influencePage--; renderInfluence(); });
  document.getElementById('inf-next').addEventListener('click', () => { influencePage++; renderInfluence(); });

  /* Copycat click */
  document.getElementById('copycat-list').addEventListener('click', e => {
    const item = e.target.closest('[data-idx]');
    if (!item) return;
    document.querySelectorAll('.copycat-item').forEach(el => el.classList.remove('is-selected'));
    item.classList.add('is-selected');
    const sel = currentResults[+item.dataset.idx];
    if (sel) { renderDetail(sel); renderHighlighter(currentQueryText, currentQueryName, sel); }
  });

  /* Form submit */
  document.getElementById('main-form').addEventListener('submit', handleSubmit);
}

/* ── Mode switching ─────────────────────────────────────────────── */
function setMode(mode) {
  inputMode = mode;
  const title = document.getElementById('panel-title');
  const desc = document.getElementById('panel-desc');

  if (mode === 'upload') {
    title.textContent = 'Document Comparison';
    desc.textContent = 'Upload an original file and one or more test files to find similarity patterns.';
  } else if (mode === 'type') {
    title.textContent = 'Direct Text Analysis';
    desc.textContent = 'Paste or type text directly into the fields below to compare documents without uploading.';
  } else if (mode === 'professor') {
    title.textContent = 'Professor Batch Analysis';
    desc.textContent = 'Analyze an entire set of student submissions at once to generate a class-wide similarity ranking.';
  }

  document.getElementById('panel-upload').classList.toggle('hidden', mode !== 'upload');
  document.getElementById('panel-type').classList.toggle('hidden', mode !== 'type');
  document.getElementById('panel-professor').classList.toggle('hidden', mode !== 'professor');
  document.getElementById('submit-btn').classList.toggle('hidden', mode === 'professor');
  document.getElementById('prof-submit-btn').classList.toggle('hidden', mode !== 'professor');

  /* Exclusivity for outputs */
  document.getElementById('results-section').classList.toggle('hidden', mode === 'professor');
  document.getElementById('prof-results').classList.toggle('hidden', mode !== 'professor');
}

function switchProfTab(tab) {
  document.querySelectorAll('.ptab').forEach(b => b.classList.toggle('active', b.dataset.ptab === tab));
  document.querySelectorAll('.ptab-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`ptab-${tab}`);
  if (panel) panel.classList.add('active');
}

/* ── Form submit ────────────────────────────────────────────────── */
async function handleSubmit(e) {
  e.preventDefault();
  const status = document.getElementById('status-msg');
  const btn = inputMode === 'professor' ? document.getElementById('prof-submit-btn') : document.getElementById('submit-btn');

  const fd = new FormData();

  if (inputMode === 'professor') {
    const files = Array.from(document.getElementById('batch-documents').files);
    if (!files.length) { status.textContent = 'Please add at least one student submission.'; return; }
    files.forEach(f => fd.append('batch_documents', f));
    btn.disabled = true;
    status.textContent = 'Running batch analysis…';
    try {
      const data = await apiFetch('/api/professor/ranking', fd);
      renderProfResults(data);
      status.textContent = 'Batch analysis completed.';
    } catch (err) { status.textContent = err.message; }
    finally { btn.disabled = false; }
    return;
  }

  if (inputMode === 'upload') {
    const qf = document.getElementById('query-file').files[0];
    const dfs = Array.from(document.getElementById('documents').files);
    if (!qf) { status.textContent = 'Please choose an original file.'; return; }
    if (!dfs.length) { status.textContent = 'Please choose at least one test file.'; return; }
    fd.append('query_file', qf);
    dfs.forEach(f => fd.append('documents', f));
  } else {
    const qt = document.getElementById('query-text').value.trim();
    const tt = document.getElementById('test-text').value.trim();
    if (!qt) { status.textContent = 'Please type the original text.'; return; }
    if (!tt) { status.textContent = 'Please type the test text.'; return; }
    fd.append('query_text', qt);
    fd.append('test_text', tt);
    fd.append('query_name', document.getElementById('query-name').value.trim() || 'typed_original.txt');
    fd.append('test_name', document.getElementById('test-name').value.trim() || 'typed_test.txt');
  }

  btn.disabled = true;
  status.textContent = 'Running analysis…';
  try {
    const data = await apiFetch('/api/analyze', fd);
    renderResults(data);
    status.textContent = 'Analysis completed successfully.';
  } catch (err) { status.textContent = err.message; document.getElementById('results-section').classList.add('hidden'); }
  finally { btn.disabled = false; }
}

async function apiFetch(url, fd) {
  let res;
  try { res = await fetch(url, { method: 'POST', body: fd }); }
  catch { throw new Error('Could not connect to the backend. Is api.py running?'); }
  const raw = await res.text();
  let data;
  try { data = JSON.parse(raw); } catch { throw new Error(`Non-JSON response (status ${res.status}).`); }
  if (!res.ok) throw new Error(data?.error || `Server error ${res.status}.`);
  return data;
}

/* ── Batch preview ──────────────────────────────────────────────── */
function renderBatchPreview() {
  const files = Array.from(document.getElementById('batch-documents').files);
  document.getElementById('batch-count').textContent = `${files.length} file${files.length === 1 ? '' : 's'}`;
  const grid = document.getElementById('batch-grid');
  grid.innerHTML = files.map((f, i) => `
    <div class="batch-card">
      <div class="batch-num">${i + 1}</div>
      <div class="batch-info">
        <strong>${esc(f.name)}</strong>
        <span>${Math.max(1, Math.round(f.size / 1024))} KB</span>
      </div>
    </div>
  `).join('') || '';
}

/* ── Render results ─────────────────────────────────────────────── */
function renderResults(data) {
  currentResults = data.ranked_documents || [];
  currentQueryText = data.query_text || '';
  currentQueryName = data.query_name || 'Original Document';

  document.getElementById('results-section').classList.remove('hidden');
  document.getElementById('summary-sub').textContent = `Comparing against: ${currentQueryName}`;

  /* Summary pills */
  document.getElementById('summary-pills').innerHTML = [
    ['Compared', data.document_count ?? 0],
    ['Similar', data.similar_count ?? 0],
    ['Paraphrased', data.paraphrased_count ?? 0],
    ['Vocab Size', data.vocabulary_size ?? 0],
  ].map(([l, v]) => `
    <div class="s-pill">
      <span class="s-pill-label">${l}</span>
      <span class="s-pill-value">${v}</span>
    </div>
  `).join('');

  /* Copycat list */
  document.getElementById('copycat-list').innerHTML = currentResults.map((item, i) => `
    <article class="copycat-item${i === 0 ? ' is-selected' : ''}" data-idx="${i}">
      <div class="cc-rank">${i + 1}</div>
      <div class="cc-info">
        <div class="cc-name">${esc(item.document_name || 'Unknown')}</div>
        <div class="cc-summary">${esc(item.document_summary || '')}</div>
      </div>
      <div class="cc-chips">
        <span class="cc-chip hi">${Math.round(item.influence_score || 0)}%</span>
        <span class="cc-chip">TF-IDF ${pct3(item.tfidf_cosine_similarity)}</span>
        <span class="cc-chip">BOW ${pct3(item.bow_cosine_similarity)}</span>
        <span class="cc-chip">${esc(item.paraphrase_label || '')}</span>
      </div>
    </article>
  `).join('');

  if (currentResults[0]) {
    renderDetail(currentResults[0]);
    renderHighlighter(currentQueryText, currentQueryName, currentResults[0]);
  }

  document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderDetail(item) {
  const score = Math.min(100, Math.max(0, item.influence_score || 0));
  const cls = score >= 75 ? 'hi' : score >= 50 ? 'mid' : 'lo';

  document.getElementById('gauge-content').innerHTML = `
    <div class="gauge-layout">
      <div class="gauge-wrap">
        <div class="gauge-shell ${cls}" style="--gauge-score:${score}">
          <div class="gauge-inner">
            <span class="gauge-val">${Math.round(score)}%</span>
            <span class="gauge-lbl">${esc(item.paraphrase_label || '')}</span>
          </div>
        </div>
      </div>
      <div>
        <div class="gauge-kicker">Top matched document</div>
        <div class="gauge-name">${esc(item.document_name || '')}</div>
        <div class="gauge-rel">${esc(item.relationship_summary || '')}</div>
      </div>
    </div>
  `;

  const allTerms = item.shared_words?.shared_words || [];
  const topTerms = item.top_terms || [];
  const lines = Array.isArray(item.paraphrase_explanation) ? item.paraphrase_explanation : [];

  document.getElementById('explain-content').innerHTML = `
    <div class="ev-card full">
      <span class="ev-label">Shared Vocabulary</span>
      <div class="term-cloud">
        ${allTerms.length ? allTerms.map(t => `<span class="term-badge ${topTerms.includes(t) ? 'prime' : ''}">${esc(t)}</span>`).join('') : '<em>None detected</em>'}
      </div>
    </div>
    ${lines.map(l => `<div class="ev-card"><span class="ev-label">Evidence</span><p>${esc(l)}</p></div>`).join('')}
  `;

  document.getElementById('reco-content').textContent =
    `${item.document_name || 'This document'} scores ${Math.round(score)}% on the copycat gauge — ${item.paraphrase_label || ''}. ${item.relationship_summary || ''}`;
}

function renderHighlighter(queryText, queryName, item) {
  const sw = item.shared_words;
  const count = sw?.word_count ?? 0;
  const badge = document.getElementById('word-badge');
  badge.textContent = `${count} word${count === 1 ? '' : 's'} shared`;
  badge.className = `word-badge${count > 0 ? ' on' : ''}`;

  document.getElementById('hl-lbl-a').textContent = queryName || 'Original Document';
  document.getElementById('hl-lbl-b').textContent = item.document_name || 'Test Document';

  document.getElementById('hl-a').innerHTML = buildHl(sw?.raw_text_a || queryText || '', sw?.spans_a || []);
  document.getElementById('hl-b').innerHTML = buildHl(sw?.raw_text_b || '', sw?.spans_b || []);
}

function buildHl(text, spans) {
  if (!text) return `<span class="empty-state">No text available.</span>`;
  if (!spans.length) return `<p>${esc(text)}</p>`;
  let out = '', cur = 0;
  for (const s of spans) {
    if (s.start > cur) out += esc(text.slice(cur, s.start));
    const c = s.tier === 'high' ? 'hl-high' : s.tier === 'medium' ? 'hl-medium' : 'hl-low';
    out += `<mark class="${c}" title="${esc(s.word)} — ${s.tier} significance">${esc(text.slice(s.start, s.end))}</mark>`;
    cur = s.end;
  }
  if (cur < text.length) out += esc(text.slice(cur));
  return `<p>${out}</p>`;
}

/* ── Professor results ──────────────────────────────────────────── */
function renderProfResults(data) {
  currentInfluenceFindings = data.influence_findings || [];
  currentSimilarityHeatMap = data.similarity_heat_map || null;
  influencePage = 1;

  document.getElementById('prof-results').classList.remove('hidden');
  document.getElementById('results-section').classList.add('hidden');

  document.getElementById('prof-overview-txt').textContent =
    `${data.submission_count ?? 0} submission(s) loaded. ${data.interpretation || ''}`;

  document.getElementById('ranking-body').innerHTML = (data.ranked_submissions || []).map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${esc(s.document_name || '')}</strong></td>
      <td><strong>${pct(s.writing_quality_score)}</strong><div class="td-note">${esc(s.writing_feedback || '')}</div></td>
      <td><strong>${pct(s.tfidf_uniqueness_score)}</strong><div class="td-note">${s.unique_term_count ?? 0} unique terms</div></td>
      <td><strong>${pct3(s.tfidf_score)}</strong><div class="td-note">${esc(s.tfidf_score_level || '')}</div></td>
      <td><strong>${pct3(s.bow_score)}</strong><div class="td-note">${esc(s.bow_score_level || '')}</div></td>
      <td><strong>${s.word_count ?? 0}</strong><div class="td-note">${s.sentence_count ?? 0} sentences</div></td>
      <td>${esc(s.writing_feedback || '')}</td>
    </tr>
  `).join('');

  renderSimCount(currentSimilarityHeatMap);
  renderHeatMap(currentSimilarityHeatMap);
  renderInfluence();
  switchProfTab('overview');
}

function renderSimCount(mapData) {
  currentSimilarityHeatMap = mapData;
  const grid = document.getElementById('sim-count-grid');
  if (!mapData) { grid.innerHTML = `<p class="empty-state">No data available.</p>`; return; }

  const labels = mapData.matrix?.labels || [];
  const rows = mapData.matrix?.rows || [];
  const thresh = +document.getElementById('sim-thresh').value;
  const mode = document.getElementById('sim-filter').value;
  const map = new Map(labels.map(l => [l, []]));

  rows.forEach((row, ri) => {
    (row.similarities || []).forEach((cell, ci) => {
      if (ci <= ri) return;
      const tf = cell.tfidf_cosine_similarity ?? 0;
      const bow = cell.bow_cosine_similarity ?? 0;
      const hit = mode === 'tfidf' ? tf >= thresh : mode === 'bow' ? bow >= thresh : (tf >= thresh || bow >= thresh);
      if (!hit) return;
      const src = row.document_name || labels[ri];
      const tgt = cell.target_document || labels[ci];
      map.get(src)?.push({ name: tgt, tf, bow });
      map.get(tgt)?.push({ name: src, tf, bow });
    });
  });

  grid.innerHTML = Array.from(map.entries()).map(([name, matches]) => `
    <div class="sim-card">
      <strong>${esc(name)}</strong>
      <p>Similar to ${matches.length} classmate${matches.length === 1 ? '' : 's'}</p>
      ${matches.length ? `
        <details class="simd">
          <summary>View matches</summary>
          <ul class="sml">
            ${matches.map(m => `<li>${esc(m.name)}<span>TF-IDF: ${pct3(m.tf)} · BOW: ${pct3(m.bow)}</span></li>`).join('')}
          </ul>
        </details>` : ''}
    </div>
  `).join('');
}

function renderHeatMap(mapData) {
  if (!mapData) { document.getElementById('heat-head').innerHTML = ''; document.getElementById('heat-body').innerHTML = ''; return; }
  document.getElementById('heat-summary-txt').textContent = mapData.summary || '';
  const labels = mapData.matrix?.labels || [];
  const rows = mapData.matrix?.rows || [];

  document.getElementById('heat-head').innerHTML =
    `<tr><th>Student</th>${labels.map(l => `<th>${esc(l)}</th>`).join('')}</tr>`;

  document.getElementById('heat-body').innerHTML = rows.map(row => `
    <tr>
      <th style="text-align:left;padding:10px 14px;background:var(--panel-2);font-size:0.8rem;">${esc(row.document_name || '')}</th>
      ${(row.similarities || []).map(c => {
    const s = c.similarity_score ?? 0;
    const cls = c.similarity_level === 'same document' ? 'heat-vs' : s >= 0.72 ? 'heat-hi' : s >= 0.4 ? 'heat-mid' : 'heat-lo';
    return `<td class="heat-cell ${cls}"><strong>${pct3(s)}</strong><div class="td-note">${esc(c.similarity_level || '')}</div></td>`;
  }).join('')}
    </tr>
  `).join('');
}

function renderInfluence() {
  const filtered = currentInfluenceFindings.filter(item => {
    const f = document.getElementById('inf-filter').value;
    const s = item.influence_score ?? 0;
    if (f === 'all') return true;
    const [a, b] = f.split('-').map(Number);
    return s >= a && s <= b;
  });

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / INFLUENCE_PAGE_SIZE));
  influencePage = Math.min(pages, Math.max(1, influencePage));
  const start = (influencePage - 1) * INFLUENCE_PAGE_SIZE;
  const items = filtered.slice(start, start + INFLUENCE_PAGE_SIZE);

  document.getElementById('inf-body').innerHTML = items.length
    ? items.map((item, i) => `
        <tr>
          <td>${start + i + 1}</td>
          <td><strong>${esc(item.source_document || '')}</strong><div class="td-note">File ${item.source_position ?? ''}</div></td>
          <td><strong>${esc(item.target_document || '')}</strong><div class="td-note">File ${item.target_position ?? ''}</div></td>
          <td>${esc(item.influence_type || '')}</td>
          <td>${esc(item.decision || '')}</td>
          <td><strong>${pct(item.influence_score)}</strong></td>
          <td>${pct3(item.tfidf_cosine_similarity)}</td>
          <td>${pct3(item.bow_cosine_similarity)}</td>
          <td>${esc(item.explanation || '')}</td>
        </tr>
      `).join('')
    : `<tr><td colspan="9"><p class="empty-state">No pairs match the filter.</p></td></tr>`;

  const vs = total === 0 ? 0 : start + 1;
  const ve = Math.min(start + items.length, total);
  document.getElementById('inf-pag-txt').textContent = `Showing ${vs}–${ve} of ${total} pairs`;
  document.getElementById('inf-page-ind').textContent = `Page ${influencePage} of ${pages}`;
  document.getElementById('inf-prev').disabled = influencePage <= 1;
  document.getElementById('inf-next').disabled = influencePage >= pages;
}

/* ── Helpers ────────────────────────────────────────────────────── */
function pct(v) { const n = +v; return isFinite(n) ? `${Math.round(n)}%` : 'N/A'; }
function pct3(v) { const n = +v; return isFinite(n) ? n.toFixed(3) : 'N/A'; }
function esc(t) { return String(t).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;'); }

/* ── Boot ───────────────────────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp, { once: true });
} else {
  renderApp();
}