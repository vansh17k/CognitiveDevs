/**
 * API Service Client
 * ==================
 * 
 * 🎓 DJANGO DEVELOPER GUIDE:
 * This module is the client-side API bridge (equivalent to Python `requests.get()` or `requests.post()` / Axios).
 * It communicates directly with our backend endpoints in `server.ts`.
 */

export const apiService = {
  /**
   * Health Check
   * GET /api/health
   */
  async checkHealth() {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch (err) {
      console.warn('Backend health check error:', err);
      return { status: 'offline', error: err.message };
    }
  },

  /**
   * Run Visual OCR & AI Compliance Analysis
   * POST /api/scan/analyze
   * 
   * (Django: views.analyze_package)
   */
  async analyzeScan(payload) {
    try {
      const res = await fetch('/api/scan/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      console.warn('Backend scan analysis error, using client fallback:', err);
      return null;
    }
  },

  /**
   * Request Gemini Legal Explainability for a specific violation
   * POST /api/ai/explain-violation
   * 
   * (Django: views.explain_violation)
   */
  async explainViolation(violation, product) {
    try {
      const res = await fetch('/api/ai/explain-violation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ violation, product })
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      console.warn('Backend explain violation error:', err);
      return null;
    }
  },

  /**
   * Fetch Official Legal Metrology PCR-2011 Statutory Rules
   * GET /api/rules
   * 
   * (Django: RuleListView / RuleViewSet)
   */
  async getRules() {
    try {
      const res = await fetch('/api/rules');
      if (!res.ok) throw new Error('Failed to load rules');
      return await res.json();
    } catch (err) {
      console.warn('Backend getRules error:', err);
      return null;
    }
  },

  /**
   * Fetch Centralized Inspector Requests & Complaints
   * GET /api/requests
   * 
   * (Django: views.InspectorRequestViewSet.list)
   */
  async getRequests(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.inspectorId) query.append('inspectorId', params.inspectorId);
      if (params.status) query.append('status', params.status);
      if (params.priority) query.append('priority', params.priority);
      if (params.category) query.append('category', params.category);
      if (params.search) query.append('search', params.search);

      const res = await fetch(`/api/requests?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch requests');
      return await res.json();
    } catch (err) {
      console.warn('Backend getRequests error:', err);
      return null;
    }
  },

  /**
   * Submit a new Complaint/Request from an Inspector
   * POST /api/requests
   * 
   * (Django: views.InspectorRequestViewSet.create)
   */
  async createRequest(payload) {
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create request');
      return await res.json();
    } catch (err) {
      console.warn('Backend createRequest error:', err);
      return null;
    }
  },

  /**
   * DGM Action: Update status, approve/reject/resolve & add remarks
   * PATCH /api/requests/:id
   * 
   * (Django: views.InspectorRequestViewSet.partial_update)
   */
  async updateRequest(id, payload) {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update request');
      return await res.json();
    } catch (err) {
      console.warn('Backend updateRequest error:', err);
      return null;
    }
  }
};
