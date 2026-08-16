import { admin_api } from "@/api_factory/modules/admin";
import { wallets_api } from "@/api_factory/modules/wallets";
import { ref } from 'vue';
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useAdminStats = () => {
  const loading = ref(false);
  const stats = ref<any>(null);
  const chartData = ref<any[]>([]);

  const fetchStats = async () => {
    loading.value = true;
    try {
      const [res, chartRes] = await Promise.all([
        admin_api.getDashboardStats(),
        admin_api.getChartData(30)
      ]);
      stats.value = res.data;
      chartData.value = chartRes.data;
    } finally {
      loading.value = false;
    }
  };

  return { loading, stats, chartData, fetchStats };
};

export const useAdminUsers = () => {
  const loading = ref(false);
  const users = ref<any[]>([]);

  const fetchUsers = async () => {
    loading.value = true;
    try {
      const res = await admin_api.getUsers();
      users.value = res.data.users || res.data;
    } finally {
      loading.value = false;
    }
  };

  return { loading, users, fetchUsers };
};

export const useAdminVendors = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false);
  const vendors = ref<any[]>([]);

  const fetchVendors = async () => {
    loading.value = true;
    try {
      const res = await admin_api.getVendors();
      vendors.value = res.data.vendors || res.data;
    } finally {
      loading.value = false;
    }
  };

  const approveVendor = async (id: string) => {
    try {
      await admin_api.approveVendor(id);
      showToast({ title: "Success", message: "Vendor approved successfully", toastType: "success" });
      await fetchVendors();
    } catch (e) {}
  };

  const rejectVendor = async (id: string) => {
    try {
      await admin_api.rejectVendor(id);
      showToast({ title: "Success", message: "Vendor rejected successfully", toastType: "success" });
      await fetchVendors();
    } catch (e) {}
  };

  const toggleVendorVisibility = async (id: string, isVisible: boolean) => {
    try {
      await admin_api.toggleVendorVisibility(id, { isVisible });
      showToast({ title: "Success", message: `Vendor is now ${isVisible ? 'visible' : 'hidden'}`, toastType: "success" });
      await fetchVendors();
    } catch (e: any) {
      showToast({ title: "Error", message: e.response?.data?.message || "Failed to toggle visibility", toastType: "error" });
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      await admin_api.deleteVendor(id);
      showToast({ title: "Success", message: "Vendor deleted permanently", toastType: "success" });
      await fetchVendors();
    } catch (e: any) {
      showToast({ title: "Error", message: e.response?.data?.message || "Failed to delete vendor", toastType: "error" });
    }
  };

  return { loading, vendors, fetchVendors, approveVendor, rejectVendor, toggleVendorVisibility, deleteVendor };
};

export const useAdminReports = () => {
  const loading = ref(false);
  const reports = ref<any[]>([]);
  const total = ref(0);
  const stats = ref<any>({ pending: 0, investigating: 0, resolved: 0, dismissed: 0 });

  const fetchReports = async (page = 1, limit = 50, status?: string) => {
    loading.value = true;
    try {
      const res = await admin_api.getReports(page, limit, status);
      const data = res.data;
      reports.value = data?.reports || (Array.isArray(data) ? data : []);
      total.value = data?.total || reports.value.length;
      if (data?.stats) stats.value = data.stats;
    } finally {
      loading.value = false;
    }
  };

  return { loading, reports, total, stats, fetchReports };
};

export const useAdminFinances = () => {
  const loading = ref(false);
  const stats = ref<any>(null);
  const transactions = ref<any[]>([]);

  const fetchFinances = async () => {
    loading.value = true;
    try {
      const [statsRes, txRes, dashboardStatsRes] = await Promise.all([
        wallets_api.getGlobalStats(),
        wallets_api.getTransactions(),
        admin_api.getDashboardStats()
      ]);
      stats.value = {
        ...statsRes.data,
        totalCommissions: dashboardStatsRes.data.totalRevenue || 0
      };
      transactions.value = txRes.data;
    } finally {
      loading.value = false;
    }
  };

  const approvePayout = async (id: string) => {
    const { showToast } = useCustomToast();
    loading.value = true;
    try {
      await wallets_api.approvePayout(id);
      showToast({ title: 'Success', message: 'Payout approved successfully', toastType: 'success' });
      await fetchFinances();
    } catch (error: any) {
      showToast({ title: 'Error', message: error.message || 'Failed to approve payout', toastType: 'error' });
    } finally {
      loading.value = false;
    }
  };

  const rejectPayout = async (id: string) => {
    const { showToast } = useCustomToast();
    loading.value = true;
    try {
      await wallets_api.rejectPayout(id);
      showToast({ title: 'Success', message: 'Payout rejected successfully', toastType: 'success' });
      await fetchFinances();
    } catch (error: any) {
      showToast({ title: 'Error', message: error.message || 'Failed to reject payout', toastType: 'error' });
    } finally {
      loading.value = false;
    }
  };

  const downloadReceipt = async (id: string) => {
    const { showToast } = useCustomToast();
    try {
      const res = await wallets_api.downloadReceipt(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      showToast({ title: 'Error', message: error.message || 'Failed to download receipt', toastType: 'error' });
    }
  };

  const markPayoutAsPaid = async (id: string) => {
    const { showToast } = useCustomToast();
    loading.value = true;
    try {
      await wallets_api.markPayoutAsPaid(id);
      showToast({ title: 'Success', message: 'Payout marked as paid manually', toastType: 'success' });
      await fetchFinances();
    } catch (error: any) {
      showToast({ title: 'Error', message: error.message || 'Failed to update payout', toastType: 'error' });
    } finally {
      loading.value = false;
    }
  };

  return { loading, stats, transactions, fetchFinances, approvePayout, rejectPayout, markPayoutAsPaid, downloadReceipt };
};
