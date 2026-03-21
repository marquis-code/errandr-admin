import { admin_api } from "@/api_factory/modules/admin";
import { wallets_api } from "@/api_factory/modules/wallets";
import { ref } from 'vue';
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useAdminStats = () => {
  const loading = ref(false);
  const stats = ref<any>(null);

  const fetchStats = async () => {
    loading.value = true;
    try {
      const res = await admin_api.getDashboardStats();
      stats.value = res.data;
    } finally {
      loading.value = false;
    }
  };

  return { loading, stats, fetchStats };
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

  return { loading, vendors, fetchVendors, approveVendor, rejectVendor };
};

export const useAdminReports = () => {
  const loading = ref(false);
  const reports = ref<any[]>([]);

  const fetchReports = async () => {
    loading.value = true;
    try {
      const res = await admin_api.getReports();
      reports.value = res.data;
    } finally {
      loading.value = false;
    }
  };

  return { loading, reports, fetchReports };
};

export const useAdminFinances = () => {
  const loading = ref(false);
  const stats = ref<any>(null);
  const transactions = ref<any[]>([]);

  const fetchFinances = async () => {
    loading.value = true;
    try {
      const [statsRes, txRes] = await Promise.all([
        wallets_api.getGlobalStats(),
        wallets_api.getTransactions()
      ]);
      stats.value = statsRes.data;
      transactions.value = txRes.data;
    } finally {
      loading.value = false;
    }
  };

  return { loading, stats, transactions, fetchFinances };
};
