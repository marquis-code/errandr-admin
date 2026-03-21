import { admin_api } from "@/api_factory/modules/admin";
import { ref } from 'vue';
import { useCustomToast } from "@/composables/core/useCustomToast";
import { useLoader } from "@/composables/core/useLoader";

export const useAdminDashboard = () => {
  const { showToast } = useCustomToast();
  const { startLoading, stopLoading } = useLoader();
  const loading = ref(false);
  const stats = ref<any>(null);
  const pendingVendors = ref<any[]>([]);
  const recentOrders = ref<any[]>([]);

  const fetchDashboardData = async () => {
    loading.value = true;
    try {
      const [sRes, vRes, oRes] = await Promise.all([
        admin_api.getDashboardStats(),
        admin_api.getPendingVendors(),
        admin_api.getRecentOrders()
      ]);
      stats.value = sRes.data;
      pendingVendors.value = vRes.data.vendors || vRes.data; // Handle different API shapes
      recentOrders.value = oRes.data;
    } catch (e) { /* Axios handles global error */ }
    finally {
      loading.value = false;
    }
  };

  const approveVendor = async (id: string) => {
    startLoading('Approving vendor...');
    try {
      await admin_api.approveVendor(id);
      showToast({
        title: "Vendor Approved",
        message: "The vendor can now start selling on Errandr.",
        toastType: "success",
      });
      await fetchDashboardData();
    } finally {
      stopLoading();
    }
  };

  const rejectVendor = async (id: string) => {
    startLoading('Rejecting application...');
    try {
      await admin_api.rejectVendor(id);
      showToast({
        title: "Vendor Rejected",
        message: "The application has been declined.",
        toastType: "error",
      });
      await fetchDashboardData();
    } finally {
      stopLoading();
    }
  };

  return { loading, stats, pendingVendors, recentOrders, fetchDashboardData, approveVendor, rejectVendor };
};
