/**
 * TruthLens API Service Layer
 * Connects React frontend to Flask REST backend (http://localhost:5050)
 * with graceful fallback simulation if the server is offline.
 */

const API_BASE_URL = 'http://localhost:5050/api';

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (res.ok) return await res.json();
  } catch (e) {
    // server offline
  }
  return { status: 'offline', platform: 'TruthLens (Offline Mode)', acceleration: { device: 'Client JS Engine' } };
}

export async function analyzeMultimodal(file, text, language) {
  try {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (text) {
      formData.append('text', text);
    }
    if (language) {
      formData.append('language', language);
    }

    const res = await fetch(`${API_BASE_URL}/analyze/multimodal`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('[TruthLens API] Backend unreachable, using client forensic fallback.');
  }
  return null;
}

export async function analyzeText(text, language) {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('[TruthLens API] Text endpoint unreachable.');
  }
  return null;
}

export async function analyzeUrl(url) {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('[TruthLens API] URL endpoint unreachable.');
  }
  return null;
}

export async function getInvestigations(limit = 50) {
  try {
    const res = await fetch(`${API_BASE_URL}/investigations?limit=${limit}`);
    if (res.ok) {
      const data = await res.json();
      return data.investigations || [];
    }
  } catch (e) {
    console.warn('[TruthLens API] Investigations history unreachable.');
  }
  return [];
}

export async function deleteInvestigation(caseId) {
  try {
    const res = await fetch(`${API_BASE_URL}/investigations/${caseId}`, {
      method: 'DELETE',
    });
    if (res.ok) return true;
  } catch (e) {
    console.warn('[TruthLens API] Delete investigation unreachable.');
  }
  return false;
}

export async function getFactChecks(query = '', language = '', category = '') {
  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (language && language !== 'all') params.append('lang', language);
    if (category && category !== 'all') params.append('category', category);

    const res = await fetch(`${API_BASE_URL}/fact-checks?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data.fact_checks || [];
    }
  } catch (e) {
    console.warn('[TruthLens API] Fact-checks unreachable.');
  }
  return [];
}

export async function submitFeedback(caseId, rating, analystVerdict = '', notes = '') {
  try {
    const res = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        case_id: caseId,
        rating,
        analyst_verdict: analystVerdict,
        notes,
      }),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('[TruthLens API] Feedback submission unreachable.');
  }
  return null;
}
