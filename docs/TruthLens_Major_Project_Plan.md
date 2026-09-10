# TruthLens — Multimodal Misinformation & Deepfake Detection Platform for Regional Languages

**Engineering Major Project Plan**

---

## 1. One-line pitch

A web platform where a user uploads a video/image or pastes a news claim/link (in English or a regional Indian language — Hindi, Punjabi, etc.), and gets back a single, explainable **Trust Score**: a deepfake-forensics verdict for media, and a misinformation verdict for text, fused into one report with visual evidence.

## 2. Why this is a good major project (and an honest note)

Most college "deepfake detector" or "fake news detector" projects exist in isolation, in English only, with a plain form + plain output. Your differentiators, realistically:

- **Fusion of two detection domains** (visual forensics + textual misinformation) into one tool — genuinely uncommon at student-project level.
- **Regional language support** — almost no open tools handle Hindi/Punjabi/etc. fake news well; this alone is a strong, defensible USP for an Indian engineering major project.
- **UI/UX as a real feature**, not an afterthought — examiners remember the demo, not the confusion matrix.

One honest flag: the GitHub repo you linked has a README that reads like an unreviewed AI-generated spec (ViT-Huge trained on 10M images, PPO reinforcement-learning agents, NeRF-based lighting validation, rPPG blood-flow validation, "0.999 AUC", "court-admissible" claims). None of that is achievable by a student team on consumer hardware in one semester, and quoting those numbers in a viva will hurt you if a panelist pushes back. This plan keeps the *ambition* but swaps in things you can actually build, train, and defend.

---

## 3. System architecture

Two independent pipelines feed a fusion layer:

- **Media pipeline**: upload → face detection/frame extraction → CNN-based forgery classifier (fine-tuned Xception or EfficientNet, not a from-scratch ViT-Huge) → Grad-CAM heatmap for explainability → media sub-score.
- **Text pipeline**: paste claim/URL/screenshot → language detection → translation to a pivot language if needed → multilingual transformer classifier (IndicBERT / MuRIL / XLM-R, fine-tuned) → similarity search against a small fact-checked claims database (embeddings + vector index) → text sub-score.
- **Fusion engine**: combines both sub-scores (weighted, or simple logistic layer) into one Trust Score with a confidence band and cites which evidence drove it.
- **Frontend**: animated dashboard rendering the score, heatmap overlay, and evidence trail.

(See the architecture diagram rendered above in chat.)

---

## 4. Realistic tech stack

**Backend**
- Python, **FastAPI** (async, good for ML inference + WebSockets for live progress updates that power your animations)
- **PyTorch** + HuggingFace `transformers` for the language model
- `timm` for a pretrained EfficientNet/Xception backbone (deepfake classifier)
- OpenCV + `mtcnn` or `retinaface` for face detection/alignment
- `faiss` or `chromadb` for the fact-check claim similarity search
- Celery + Redis (or simple background tasks) for async video processing so the UI can show a live progress animation instead of a blocking spinner

**Frontend**
- **React** + **Vite**
- **Tailwind CSS** for styling
- **Framer Motion** for component/page animation (transitions, micro-interactions)
- **GSAP** for the more elaborate scroll/hero animations if you want extra polish
- **Lottie** (`lottie-react`) for pre-made animated icons (scanning, shield, checkmark, alert)
- **Recharts** or **D3** for the animated trust-score gauge and confidence charts
- **react-dropzone** for the upload interaction

**Data / infra**
- PostgreSQL (users, scan history) + S3-compatible storage (uploaded media) — or SQLite + local disk if you want zero infra cost for a college demo
- Docker Compose to package backend + frontend + DB for your evaluation demo

---

## 5. Datasets (feasible, not fantasy)

**Deepfake detection**
- FaceForensics++ (sample/light version) — real/fake face-swap videos
- Celeb-DF (v2, sample) — higher-quality face swaps
- 140k Real and Fake Faces (Kaggle) — good for a quick baseline image classifier before tackling video

**Regional-language fake news**
- IFND (Indian Fake News Dataset) — Hindi + English
- BOOM, Vishvas News, Alt News, Fact Crescendo — scrape their published fact-checks (with attribution) as a small labeled claims database for the similarity-search layer
- LIAR dataset (English) — useful for pretraining before fine-tuning on the smaller regional-language set
- If regional-language labeled data is too thin (it usually is), translate an English fake-news dataset into Hindi/Punjabi with IndicTrans2 to bootstrap training data — be transparent about this in your report as a known limitation

**Realistic scope caveat**: don't chase state-of-the-art numbers. A well-documented 85–92% accuracy model with clear error analysis and an honest limitations section will score better in evaluation than an unverifiable claim of 99.9%.

---

## 6. UI/UX plan — where you put the "wow"

This is the part you can fully control regardless of model accuracy, so invest real time here.

**Landing page**
- Full-bleed animated hero: subtle particle/gradient-morph background (canvas or CSS, kept lightweight), headline that types in or fades up on load
- Scroll-triggered reveal of the two pipelines (media / text) as animated icons that "connect" into one Trust Score badge — this doubles as an explainer and a hook

**Upload / input screen**
- Drag-and-drop zone with a hover-glow state and a "drop to scan" micro-animation
- Language auto-detect badge that animates in once text is pasted
- Tabs (or a segmented animated toggle) to switch between "Analyze media" and "Analyze claim/text"

**Processing state**
- Don't just show a spinner — show a live "scan line" sweeping over the uploaded frame, with step labels animating in sequence ("Detecting faces… Extracting frames… Running forensic model… Cross-checking claim database…"). This is honest (it mirrors real backend steps via WebSocket progress events) and feels premium.

**Results dashboard**
- Large animated radial gauge for the Trust Score that counts up from 0 with an easing curve
- For media: video frame with a Grad-CAM heatmap overlay that fades in, plus a scrubbable timeline if you support multi-frame analysis
- For text: highlighted claim with animated underlines on the phrases that most influenced the verdict, plus a card carousel of matched fact-checks with source links
- Expandable "How we got this score" panel — an animated breakdown of the fusion weights (small bar or radial chart animating into place)
- Shareable "verdict card" (styled like a social-media card) with a subtle reveal animation — good demo moment

**Small but high-impact polish**
- Dark/light mode with a morphing sun↔moon icon toggle
- Skeleton loaders (not blank white) wherever data is fetching
- Toasts/microcopy that shift tone based on verdict (calm green pulse for "likely authentic", amber pulse for "uncertain", red pulse for "likely manipulated") — avoid anything alarmist
- Fully responsive; test the scan animation on mobile specifically, it's the easiest thing to break

---

## 7. Suggested screens

1. Landing / hero
2. Upload (media tab / text tab)
3. Live processing view
4. Results dashboard (media verdict)
5. Results dashboard (text verdict)
6. Combined trust report (fusion view)
7. History / past scans (if you add auth)
8. About / methodology & limitations page (important for viva credibility)

---

## 8. Suggested semester timeline (12–14 weeks)

| Weeks | Focus |
|---|---|
| 1–2 | Finalize scope, collect/prepare datasets, set up repo + Docker skeleton |
| 3–5 | Train and validate the deepfake classifier (image first, then video frames) |
| 5–7 | Build and fine-tune the multilingual text classifier + claim similarity search |
| 6–8 | Backend API (FastAPI), async processing, WebSocket progress events |
| 7–10 | Frontend build: layout, animations, dashboard, responsive pass |
| 10–11 | Fusion engine + end-to-end integration testing |
| 11–12 | Evaluation: accuracy, confusion matrix, latency, error analysis, UX testing with a few real users |
| 12–13 | Report writing, demo video, polish animations |
| 14 | Buffer / viva prep |

---

## 9. Evaluation plan

- Standard ML metrics per pipeline: accuracy, precision/recall, F1, confusion matrix, AUC — report honestly, including failure cases
- Cross-lingual robustness: test the text model on at least 2 regional languages beyond Hindi/English if time allows
- Latency budget: report end-to-end time for a typical video/claim, since a "forensic" tool that takes 10 minutes per image undermines the pitch
- Basic UX evaluation: 5–10 test users completing a task (upload → read verdict) with a short usability survey — a small but real evaluation section strengthens the project report a lot

---

## 10. Stretch goals (only if core is solid early)

- Browser extension that scans an image/claim on the page you're viewing
- A WhatsApp bot front-end for regional-language fact-checking, since that's where misinformation actually spreads in India
- Source credibility scoring (domain reputation) as a third signal into the fusion engine

---

## 11. Team role split (if group project)

- **ML/Backend (media)**: face detection pipeline, classifier training, Grad-CAM
- **ML/Backend (text)**: multilingual classifier, translation, claim similarity search
- **Full-stack/API**: FastAPI, async jobs, fusion logic, DB
- **Frontend/UX**: React app, animation system, responsive design, dashboard
- Everyone contributes to the report and evaluation section — panels notice when only one person can explain the ML

---

## 12. Key risks to flag in your report (do this — it builds credibility)

- Regional-language labeled data scarcity → mitigated via translation-augmented training, stated as a limitation
- Deepfake detectors generalize poorly to unseen generation methods → mention this explicitly, don't oversell
- Compute limits (student GPU) → justifies using pretrained EfficientNet/Xception instead of training a huge model from scratch
- Bias/false positives on real regional content → include a fairness/error-analysis subsection
