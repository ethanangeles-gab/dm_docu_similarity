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
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  pokeball: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M2.5 12h19"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
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
          <button class="sidebar-item active" id="sb-home" onclick="switchSidebarMode('home')" title="Home">
            ${ICON.home}
            <span>Home</span>
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
        <div class="sidebar-bottom">
          <button class="sidebar-item" id="sb-settings" onclick="switchSidebarMode('settings')" title="Settings">
            ${ICON.settings}
            <span>Settings</span>
          </button>
          <div class="sidebar-avatar" style="cursor:pointer;color:var(--muted);">${ICON.user}</div>
        </div>
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
              </div>
            </div>
          </div>
          <div class="top-right" id="poketech-header">
            <div class="poketech-brand">
              <span>PokeTech Marketing</span>
              <div class="poketech-logo">${ICON.pokeball}</div>
            </div>
          </div>
        </header>

        <main class="page-shell">
          <!-- Hero -->
          <section class="hero" style="margin-top:10px;">
            <h1>Student Writing<br>Insight &amp; Alignment</h1>
            <p class="hero-desc">Discover the unique voice of every document. Identify shared content signatures and receive clear, evidence-based feedback on writing style and originality.</p>
          </section>

          <!-- Homepage panel -->
          <section class="panel" id="panel-home">
             <div class="panel-title">Welcome to DocuCheck</div>
             <p class="panel-sub">Choose an analysis method to get started. All comparisons use our advanced lexical matching foundation.</p>
             
             <div class="home-grid">
               <div class="home-card" onclick="switchSidebarMode('type')">
                 <div class="home-card-icon">${ICON.plus}</div>
                 <div class="home-card-content">
                   <h3>Direct Text Analysis</h3>
                   <p>Paste or type your content directly to compare two pieces of writing instantly.</p>
                 </div>
               </div>
               <div class="home-card" onclick="switchSidebarMode('professor')">
                 <div class="home-card-icon">${ICON.similarity}</div>
                 <div class="home-card-content">
                   <h3>Document Batch Analysis</h3>
                   <p>Upload a set of student submissions to rank them by originality and detect shared styles.</p>
                 </div>
               </div>
             </div>

             <div class="about-section">
               <div class="about-header">
                 <div class="about-badge">System Insights</div>
                 <h2>Understanding the Foundation</h2>
                 <p>DocuCheck is more than a simple text matcher. It uses statistical linguistic models to find patterns that the human eye might miss.</p>
               </div>

               <div class="insight-grid">
                 <div class="insight-card">
                   <h4>${ICON.detect} System Purpose</h4>
                   <p>Created to provide educators and students with a <strong>transparent</strong> tool for academic integrity. We focus on evidence, not just opaque scores.</p>
                 </div>
                 <div class="insight-card">
                   <h4>${ICON.user} Primary Use Case</h4>
                   <p>Optimized for <strong>Classroom Labs</strong> where multiple students submit work on similar topics. It identifies stylistic clusters and shared wording paths.</p>
                 </div>
                 <div class="insight-card">
                   <h4>${ICON.similarity} The Logic Model</h4>
                   <p>We use a hybrid of <strong>Signature Matching</strong> and <strong>Wording Alignment</strong>. This ensures we catch both direct copies and clever paraphrasing.</p>
                 </div>
                 <div class="insight-card">
                   <h4>${ICON.grammar} Why This Method?</h4>
                   <p>Transparency. Modern "Black-box" AI models can't explain their scores. Our method <strong>highlights exactly which words</strong> triggered the match.</p>
                 </div>
               </div>

               <div class="info-group">
                 <div class="info-col">
                   <h3>How It Works</h3>
                   <div class="step-list">
                     <div class="step-item">
                       <span class="step-num">1</span>
                       <div><strong>Tokenization:</strong> Every document is broken down into its core vocabulary components.</div>
                     </div>
                     <div class="step-item">
                       <span class="step-num">2</span>
                       <div><strong>Significance Weighting:</strong> Rare, technical words are given higher "value" than common filler words.</div>
                     </div>
                     <div class="step-item">
                       <span class="step-num">3</span>
                       <div><strong>Vectorization:</strong> Each document is projected into a mathematical space representing its content style.</div>
                     </div>
                     <div class="step-item">
                       <span class="step-num">4</span>
                       <div><strong>Match Calculation:</strong> We measure the "angular similarity" between these vectors to find hidden connections.</div>
                     </div>
                   </div>
                 </div>
                 <div class="info-col">
                   <h3>Interpreting Results</h3>
                   <p>Our intelligence isn't just in the score, but in the <strong>Contextual Awareness</strong> of the vocabulary used.</p>
                   <div class="key-grid">
                     <div class="key-item lo">
                       <strong>0–20% Match</strong>
                       <span>Weak connection. Likely independent work.</span>
                     </div>
                     <div class="key-item mid">
                       <strong>21–59% Match</strong>
                       <span>Shared Style. Possible paraphrasing or heavy conceptual overlap.</span>
                     </div>
                     <div class="key-item hi">
                       <strong>60–90%+ Match</strong>
                       <span>Strong Match. High probability of shared wording or direct content sourcing.</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </section>

          <!-- Input panel -->
          <section class="panel hidden" id="input-panel">
            <div class="panel-title" id="panel-title">Input Options</div>
            <p class="panel-sub" id="panel-desc">Select a mode from the sidebar to begin.</p>

            <form id="main-form" autocomplete="off">

              <!-- Upload panel (Hidden in new UI flow but kept for logic) -->
              <div id="panel-upload" class="form-grid hidden">
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

              <!-- Settings panel -->
              <div id="panel-settings" class="hidden">
                 <div class="settings-grid">
                    <div class="setting-item">
                      <div class="setting-info">
                        <div class="setting-label">Analysis Sensitivity</div>
                        <div class="setting-desc">Adjust how strictly the system flags content matches.</div>
                      </div>
                      <div class="setting-control">
                        <select id="set-sensitivity" class="field-input" style="width: 140px;">
                          <option value="relaxed">Relaxed</option>
                          <option value="standard" selected>Standard</option>
                          <option value="strict">Strict</option>
                        </select>
                      </div>
                    </div>

                    <div class="setting-item">
                      <div class="setting-info">
                        <div class="setting-label">Ignore Common Words</div>
                        <div class="setting-desc">Filter out "the", "and", "is", etc. to focus on substance.</div>
                      </div>
                      <div class="setting-control">
                        <label class="toggle-switch">
                          <input type="checkbox" id="set-stopwords">
                          <span class="slider round"></span>
                        </label>
                      </div>
                    </div>

                    <div class="setting-item">
                      <div class="setting-info">
                        <div class="setting-label">Branding Mode</div>
                        <div class="setting-desc">Switch between DocuCheck Classic and PokeTech Marketing vibes.</div>
                      </div>
                      <div class="setting-control">
                        <label class="toggle-switch">
                          <input type="checkbox" id="set-branding" checked>
                          <span class="slider round"></span>
                        </label>
                      </div>
                    </div>
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
                <button class="ptab" data-ptab="ranking">Ranking</button>
                <button class="ptab" data-ptab="similarity">Similarity Map</button>
                <button class="ptab" data-ptab="heatmap">Network Grid</button>
                <button class="ptab" data-ptab="influence">Match Detection</button>
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
                  <th>Vocabulary Signature</th><th>Signature Score</th>
                  <th>Overlap Score</th><th>Word Count</th><th>Feedback</th>
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
                  <option value="tfidf">Only Signature</option>
                  <option value="bow">Only Overlap</option>
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
                  <th>Score</th><th>Signature</th><th>Overlap</th><th>Explanation</th>
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
          <div class="panel-title" style="margin-bottom:22px;">Similarity Gauge</div>
          <div id="gauge-content"></div>
        </section>

        <!-- Explanation -->
        <section class="panel">
          <div class="panel-title">Why It Looks Like a Match</div>
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
              <p class="panel-sub" style="margin-bottom:0;">Every shared word colored by vocabulary significance.</p>
            </div>
            <span class="word-badge" id="word-badge">0 words shared</span>
          </div>
          <div class="hl-legend">
            <div class="hl-li"><span class="hl-sw" style="background:rgba(212,175,55,0.18);border:1.5px solid rgba(212,175,55,0.5);"></span>Low significance</div>
            <div class="hl-li"><span class="hl-sw" style="background:rgba(184,134,11,0.18);border:1.5px solid rgba(184,134,11,0.55);"></span>Medium significance</div>
            <div class="hl-li"><span class="hl-sw" style="background:rgba(199,150,0,0.16);border:1.5px solid rgba(199,150,0,0.55);"></span>High significance</div>
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
        </main>

        <!-- Footer -->
        <footer class="app-footer">
          <div class="footer-content">
            <div class="footer-brand">
              <div class="footer-logo">${ICON.logo}</div>
              <div class="footer-title">DocuCheck</div>
            </div>
            <div class="footer-meta">
              <p>© 2026 DocuCheck • A Machine Learning Project Foundation</p>
              <nav class="footer-links">
                <a href="#">Terms</a>
                <a href="#">Privacy</a>
                <a href="#">PokeTech Marketing</a>
              </nav>
            </div>
          </div>
        </footer>
      </div><!-- /app-shell -->
    </div>
  `;

  wireEvents();
  setMode('upload');
}

/* ── Sidebar Logic ─────────────────────────────────────────────── */

window.switchSidebarMode = function (mode) {
  if (mode === 'home' || mode === 'type' || mode === 'professor' || mode === 'settings') {
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

  document.getElementById('panel-home').classList.toggle('hidden', mode !== 'home');
  document.getElementById('input-panel').classList.toggle('hidden', mode === 'home');

  if (mode === 'type') {
    title.textContent = 'Direct Text Analysis';
    desc.textContent = 'Paste or type text directly into the fields below to compare documents without uploading.';
  } else if (mode === 'professor') {
    title.textContent = 'Batch Analysis';
    desc.textContent = 'Analyze an entire set of student submissions at once to generate a class-wide similarity ranking.';
  } else if (mode === 'settings') {
    title.textContent = 'Application Settings';
    desc.textContent = 'Customize how the analysis is performed and how the interface looks.';
  }

  document.getElementById('panel-upload').classList.add('hidden'); // Always hidden now
  document.getElementById('panel-type').classList.toggle('hidden', mode !== 'type');
  document.getElementById('panel-professor').classList.toggle('hidden', mode !== 'professor');
  document.getElementById('panel-settings').classList.toggle('hidden', mode !== 'settings');
  document.getElementById('submit-btn').classList.toggle('hidden', mode === 'professor' || mode === 'settings');
  document.getElementById('prof-submit-btn').classList.toggle('hidden', mode !== 'professor');

  /* Exclusivity for outputs */
  document.getElementById('results-section').classList.toggle('hidden', true);
  document.getElementById('prof-results').classList.toggle('hidden', true);
}

function switchProfTab(tab) {
  document.querySelectorAll('.ptab').forEach(b => b.classList.toggle('active', b.dataset.ptab === tab));
  document.querySelectorAll('.ptab-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`ptab-${tab}`);
  if (panel) panel.classList.add('active');
}

/* ── Settings Logic ─────────────────────────────────────────────── */
function getSettings() {
  const defaults = {
    sensitivity: 'standard',
    remove_stopwords: false,
    branding: true
  };
  try {
    const saved = localStorage.getItem('docucheck_settings');
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch {
    return defaults;
  }
}

function saveSettings() {
  const settings = {
    sensitivity: document.getElementById('set-sensitivity').value,
    remove_stopwords: document.getElementById('set-stopwords').checked,
    branding: document.getElementById('set-branding').checked
  };
  localStorage.setItem('docucheck_settings', JSON.stringify(settings));
  applySettings(settings);
}

function applySettings(settings) {
  // Sync UI elements
  const sen = document.getElementById('set-sensitivity');
  const sw = document.getElementById('set-stopwords');
  const br = document.getElementById('set-branding');
  
  if (sen) sen.value = settings.sensitivity;
  if (sw) sw.checked = settings.remove_stopwords;
  if (br) br.checked = settings.branding;

  // Apply visual changes
  const poketech = document.getElementById('poketech-header');
  if (poketech) {
    poketech.classList.toggle('branding-hidden', !settings.branding);
  }
}

function initSettings() {
  const settings = getSettings();
  applySettings(settings);

  document.getElementById('set-sensitivity').addEventListener('change', saveSettings);
  document.getElementById('set-stopwords').addEventListener('change', saveSettings);
  document.getElementById('set-branding').addEventListener('change', saveSettings);
}

/* ── Form submit ────────────────────────────────────────────────── */
async function handleSubmit(e) {
  e.preventDefault();
  const status = document.getElementById('status-msg');
  const btn = inputMode === 'professor' ? document.getElementById('prof-submit-btn') : document.getElementById('submit-btn');

  const fd = new FormData();
  
  // Attach settings
  fd.append('settings', JSON.stringify(getSettings()));

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
        <span class="cc-chip">Signature ${pct3(item.tfidf_cosine_similarity)}</span>
        <span class="cc-chip">Overlap ${pct3(item.bow_cosine_similarity)}</span>
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
    `${item.document_name || 'This document'} scores ${Math.round(score)}% on the similarity gauge — ${item.paraphrase_label || ''}. ${item.relationship_summary || ''}`;
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
            ${matches.map(m => `<li>${esc(m.name)}<span>Signature: ${pct3(m.tf)} · Overlap: ${pct3(m.bow)}</span></li>`).join('')}
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
  document.addEventListener('DOMContentLoaded', () => {
    renderApp();
    initSettings();
    setMode('home');
  }, { once: true });
} else {
  renderApp();
  initSettings();
  setMode('home');
}