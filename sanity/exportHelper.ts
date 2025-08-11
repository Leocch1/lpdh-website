// Export utility functions for contact messages
// These can be used to trigger exports from your application

export const exportUtils = {
  // Export all contact messages
  exportAll: () => {
    window.open('/api/contact/export?format=csv', '_blank');
  },

  // Export only complaints
  exportComplaints: () => {
    window.open('/api/contact/export?format=csv&messageType=complaint', '_blank');
  },

  // Export current month
  exportThisMonth: () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    window.open(`/api/contact/export?format=csv&dateFrom=${firstDay}&dateTo=${lastDay}`, '_blank');
  },

  // Export date range
  exportDateRange: (startDate: string, endDate: string) => {
    window.open(`/api/contact/export?format=csv&dateFrom=${startDate}&dateTo=${endDate}`, '_blank');
  },

  // Export by status
  exportByStatus: (status: string) => {
    window.open(`/api/contact/export?format=csv&status=${status}`, '_blank');
  },

  // Generate export URL with custom filters
  getExportUrl: (filters: Record<string, string> = {}) => {
    const params = new URLSearchParams({ format: 'csv', ...filters });
    return `/api/contact/export?${params.toString()}`;
  },
};
