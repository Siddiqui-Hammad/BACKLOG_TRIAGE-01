import {
  DashboardStats,
  CaseListItem,
  CaseDetail,
  AlertItem,
  FeedbackAuditItem
} from '../types';

const API_BASE = '/api';

export const api = {
  async getDashboard(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
    return res.json();
  },

  async getCases(params?: {
    priority?: string;
    stage?: string;
    fast_track?: string;
    delay_status?: string;
    search?: string;
  }): Promise<CaseListItem[]> {
    const query = new URLSearchParams();
    if (params?.priority && params.priority !== 'All') query.append('priority', params.priority);
    if (params?.stage && params.stage !== 'All') query.append('stage', params.stage);
    if (params?.fast_track && params.fast_track !== 'All') query.append('fast_track', params.fast_track);
    if (params?.delay_status && params.delay_status !== 'All') query.append('delay_status', params.delay_status);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/cases?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch cases list');
    return res.json();
  },

  async getCaseDetail(caseId: string): Promise<CaseDetail> {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}`);
    if (!res.ok) throw new Error(`Failed to fetch case ${caseId}`);
    return res.json();
  },

  async createCase(caseData: Partial<CaseDetail>): Promise<CaseDetail> {
    const res = await fetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create case');
    }
    return res.json();
  },

  async uploadCsv(file: File): Promise<{ status: string; message: string; created: number; updated: number }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/cases/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to upload CSV');
    }
    return res.json();
  },

  async runTriageAnalysis(caseId: string) {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/analyze`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to run analysis');
    return res.json();
  },

  async analyzeAllCases() {
    const res = await fetch(`${API_BASE}/analyze/all`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to run batch triage');
    return res.json();
  },

  async getAlerts(): Promise<AlertItem[]> {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async submitJudgeFeedback(caseId: string, feedback: {
    engine_priority: string;
    judge_decision: string;
    action_taken: string;
    reason?: string;
    notes?: string;
  }) {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/judge-feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to submit judge feedback');
    }
    return res.json();
  },

  async getFeedbackHistory(): Promise<FeedbackAuditItem[]> {
    const res = await fetch(`${API_BASE}/feedback/history`);
    if (!res.ok) throw new Error('Failed to fetch feedback history');
    return res.json();
  },

  async getTriageStatus() {
    const res = await fetch(`${API_BASE}/triage/status`);
    if (!res.ok) throw new Error('Failed to fetch triage status');
    return res.json();
  }
};
