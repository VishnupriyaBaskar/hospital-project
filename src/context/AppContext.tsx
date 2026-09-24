import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  Branch,
  Product,
  BranchStock,
  Invoice,
  InvoiceItem,
  Staff,
  LowStockAlert,
  UserSession,
} from '../types';
import {
  INITIAL_BRANCHES,
  INITIAL_PRODUCTS,
  INITIAL_BRANCH_STOCK,
  INITIAL_STAFF,
  INITIAL_INVOICES,
} from '../data/mockData';

interface AppContextType {
  branches: Branch[];
  products: Product[];
  branchStock: BranchStock[];
  invoices: Invoice[];
  staff: Staff[];
  session: UserSession | null;
  currentAdminTab: string;
  currentStaffTab: string;
  selectedInvoice: Invoice | null;
  showWorkflowModal: boolean;
  toastMessage: string | null;

  // Navigation & Sessions
  setCurrentAdminTab: (tab: string) => void;
  setCurrentStaffTab: (tab: string) => void;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  setShowWorkflowModal: (show: boolean) => void;
  setSession: (session: UserSession | null) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;

  loginAdmin: () => void;
  loginStaffMember: (staffId: string) => void;
  logout: () => void;

  // Operations
  addBranch: (branch: Omit<Branch, 'id' | 'staffCount' | 'productCount'>) => void;
  updateBranch: (id: string, updates: Partial<Branch>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateBranchStock: (branchId: string, productId: string, addQuantity: number) => void;
  restockMultipleItems: (items: Array<{ branchId: string; productId: string; quantity: number }>) => void;
  createBill: (params: {
    branchId: string;
    branchName?: string;
    staffId: string;
    staffName: string;
    customerName?: string;
    customerPhone?: string;
    doctorName?: string;
    items: InvoiceItem[];
    paymentMethod: 'Cash' | 'Card' | 'UPI';
  }) => Invoice;

  addStaff: (staffData: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;

  // Helpers
  getLowStockAlerts: () => LowStockAlert[];
  getStockForBranch: (branchId: string) => Array<{
    product: Product;
    currentStock: number;
    threshold: number;
    status: 'Normal' | 'Low';
  }>;
  getProductStockAtBranch: (branchId: string, productId: string) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [branchStock, setBranchStock] = useState<BranchStock[]>(INITIAL_BRANCH_STOCK);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [staff, setStaff] = useState<Staff[]>(INITIAL_STAFF);

  // Default initial session: Admin
  const [session, setSession] = useState<UserSession | null>({
    role: 'admin',
    email: 'admin@gmail.com',
    staffName: 'Dr. Ramesh Kumar (Admin)',
  });

  const [currentAdminTab, setCurrentAdminTab] = useState<string>('dashboard');
  const [currentStaffTab, setCurrentStaffTab] = useState<string>('billing-dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const loginAdmin = useCallback(() => {
    setSession({
      role: 'admin',
      email: 'admin@gmail.com',
      staffName: 'Dr. Ramesh Kumar (Admin)',
    });
    setCurrentAdminTab('dashboard');
    showToast('Logged in as Central Admin');
  }, [showToast]);

  const loginStaffMember = useCallback(
    (staffId: string) => {
      const foundStaff = staff.find((s) => s.id === staffId);
      if (foundStaff) {
        setSession({
          role: 'staff',
          staffId: foundStaff.id,
          staffName: foundStaff.name,
          username: foundStaff.username,
          branchId: foundStaff.branchId,
          branchName: foundStaff.branchName,
        });
        setCurrentStaffTab('billing-dashboard');
        showToast(`Logged in as ${foundStaff.name} (${foundStaff.branchName})`);
      }
    },
    [staff, showToast]
  );

  const logout = useCallback(() => {
    setSession(null);
    showToast('Logged out successfully');
  }, [showToast]);

  // Branch CRUD
  const addBranch = useCallback(
    (branchData: Omit<Branch, 'id' | 'staffCount' | 'productCount'>) => {
      const newId = `branch-${Date.now()}`;
      const newBranch: Branch = {
        ...branchData,
        id: newId,
        staffCount: 1,
        productCount: products.length,
      };
      setBranches((prev) => [...prev, newBranch]);

      // Initialize default stock for new branch
      const newStocks: BranchStock[] = products.map((p) => ({
        branchId: newId,
        productId: p.id,
        currentStock: 20,
      }));
      setBranchStock((prev) => [...prev, ...newStocks]);
      showToast(`Branch "${newBranch.name}" created successfully`);
    },
    [products, showToast]
  );

  const updateBranch = useCallback(
    (id: string, updates: Partial<Branch>) => {
      setBranches((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
      );
      showToast('Branch details updated');
    },
    [showToast]
  );

  // Product CRUD
  const addProduct = useCallback(
    (productData: Omit<Product, 'id'>) => {
      const newId = `prod-${Date.now()}`;
      const newProduct: Product = {
        ...productData,
        id: newId,
      };
      setProducts((prev) => [...prev, newProduct]);

      // Seed stock for all existing branches
      const newStocks: BranchStock[] = branches.map((b) => ({
        branchId: b.id,
        productId: newId,
        currentStock: 25,
      }));
      setBranchStock((prev) => [...prev, ...newStocks]);
      showToast(`Product "${newProduct.name}" added to catalog`);
    },
    [branches, showToast]
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
      showToast('Product updated successfully');
    },
    [showToast]
  );

  // Update Branch Stock (Admin Action)
  const updateBranchStock = useCallback(
    (branchId: string, productId: string, addQuantity: number) => {
      setBranchStock((prev) => {
        const existing = prev.find(
          (s) => s.branchId === branchId && s.productId === productId
        );
        if (existing) {
          return prev.map((s) =>
            s.branchId === branchId && s.productId === productId
              ? { ...s, currentStock: Math.max(0, s.currentStock + addQuantity) }
              : s
          );
        } else {
          return [
            ...prev,
            { branchId, productId, currentStock: Math.max(0, addQuantity) },
          ];
        }
      });

      const branch = branches.find((b) => b.id === branchId);
      const product = products.find((p) => p.id === productId);
      showToast(
        `Added ${addQuantity} units of ${product?.name || 'Product'} to ${
          branch?.name || 'Branch'
        }`
      );
    },
    [branches, products, showToast]
  );

  // Batch restock multiple items atomically
  const restockMultipleItems = useCallback(
    (itemsToRestock: Array<{ branchId: string; productId: string; quantity: number }>) => {
      setBranchStock((prev) => {
        let updated = [...prev];
        itemsToRestock.forEach(({ branchId, productId, quantity }) => {
          const idx = updated.findIndex((s) => s.branchId === branchId && s.productId === productId);
          if (idx > -1) {
            updated[idx] = {
              ...updated[idx],
              currentStock: updated[idx].currentStock + quantity,
            };
          } else {
            updated.push({
              branchId,
              productId,
              currentStock: Math.max(0, quantity),
            });
          }
        });
        return updated;
      });
      showToast(`Restocked ${itemsToRestock.length} items successfully`);
    },
    [showToast]
  );

  // Helper: get product stock at a branch
  const getProductStockAtBranch = useCallback(
    (branchId: string, productId: string): number => {
      const record = branchStock.find(
        (s) => s.branchId === branchId && s.productId === productId
      );
      return record ? record.currentStock : 0;
    },
    [branchStock]
  );

  // Helper: get stock list for branch
  const getStockForBranch = useCallback(
    (branchId: string) => {
      return products.map((prod) => {
        const stock = getProductStockAtBranch(branchId, prod.id);
        const isLow = stock <= prod.threshold;
        return {
          product: prod,
          currentStock: stock,
          threshold: prod.threshold,
          status: isLow ? ('Low' as const) : ('Normal' as const),
        };
      });
    },
    [products, getProductStockAtBranch]
  );

  // Helper: get all low stock alerts
  const getLowStockAlerts = useCallback((): LowStockAlert[] => {
    const alerts: LowStockAlert[] = [];
    branches.forEach((branch) => {
      products.forEach((prod) => {
        const currentStock = getProductStockAtBranch(branch.id, prod.id);
        if (currentStock <= prod.threshold) {
          alerts.push({
            id: `alert-${branch.id}-${prod.id}`,
            branchId: branch.id,
            branchName: branch.name,
            productId: prod.id,
            productName: prod.name,
            currentStock,
            threshold: prod.threshold,
          });
        }
      });
    });
    return alerts;
  }, [branches, products, getProductStockAtBranch]);

  // Billing Flow: Create Bill
  const createBill = useCallback(
    (params: {
      branchId: string;
      branchName?: string;
      staffId: string;
      staffName: string;
      customerName?: string;
      customerPhone?: string;
      doctorName?: string;
      items: InvoiceItem[];
      paymentMethod: 'Cash' | 'Card' | 'UPI';
    }): Invoice => {
      const branch = branches.find((b) => b.id === params.branchId);
      const branchName = params.branchName || (branch ? branch.name : 'Branch');

      // Generate invoice number
      const nextNum = 1000 + invoices.length + 1;
      const billNo = `${nextNum}`;

      const grandTotal = Math.round(params.items.reduce((sum, item) => sum + item.amount, 0) * 100) / 100;
      const totalUnits = params.items.reduce((sum, item) => sum + item.quantity, 0);

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const day = now.getDate();
      const month = now.toLocaleString('en-US', { month: 'short' });
      const year = now.getFullYear();
      const dateTimeStr = `${day} ${month} ${year} ${timeStr}`;
      const dateIso = now.toISOString().split('T')[0];

      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        billNo,
        branchId: params.branchId,
        branchName,
        staffId: params.staffId,
        staffName: params.staffName,
        customerName: params.customerName || 'Walk-in Patient',
        customerPhone: params.customerPhone || 'N/A',
        doctorName: params.doctorName || 'General OPD',
        dateTime: dateTimeStr,
        date: dateIso,
        time: timeStr,
        items: params.items,
        totalItems: totalUnits,
        grandTotal,
        paymentMethod: params.paymentMethod,
      };

      // 1. Save invoice
      setInvoices((prev) => [newInvoice, ...prev]);

      // 2. Reduce branch stock automatically (accumulate sold quantities per product)
      setBranchStock((prev) => {
        // Map over existing branch stock
        const updated = prev.map((stockItem) => {
          if (stockItem.branchId !== params.branchId) return stockItem;
          const soldQuantity = params.items
            .filter((i) => i.productId === stockItem.productId)
            .reduce((sum, i) => sum + i.quantity, 0);

          if (soldQuantity > 0) {
            return {
              ...stockItem,
              currentStock: Math.max(0, stockItem.currentStock - soldQuantity),
            };
          }
          return stockItem;
        });
        return updated;
      });

      showToast(`Bill #${billNo} generated & stock updated!`);
      return newInvoice;
    },
    [branches, invoices.length, showToast]
  );

  // Staff management
  const addStaff = useCallback(
    (staffData: Omit<Staff, 'id'>) => {
      const newStaff: Staff = {
        ...staffData,
        id: `staff-${Date.now()}`,
      };
      setStaff((prev) => [...prev, newStaff]);
      showToast(`Staff member "${newStaff.name}" added`);
    },
    [showToast]
  );

  const updateStaff = useCallback(
    (id: string, updates: Partial<Staff>) => {
      setStaff((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
      );
      showToast('Staff member updated');
    },
    [showToast]
  );

  const value = useMemo(
    () => ({
      branches,
      products,
      branchStock,
      invoices,
      staff,
      session,
      currentAdminTab,
      currentStaffTab,
      selectedInvoice,
      showWorkflowModal,
      toastMessage,
      setCurrentAdminTab,
      setCurrentStaffTab,
      setSelectedInvoice,
      setShowWorkflowModal,
      setSession,
      showToast,
      clearToast,
      loginAdmin,
      loginStaffMember,
      logout,
      addBranch,
      updateBranch,
      addProduct,
      updateProduct,
      updateBranchStock,
      restockMultipleItems,
      createBill,
      addStaff,
      updateStaff,
      getLowStockAlerts,
      getStockForBranch,
      getProductStockAtBranch,
    }),
    [
      branches,
      products,
      branchStock,
      invoices,
      staff,
      session,
      currentAdminTab,
      currentStaffTab,
      selectedInvoice,
      showWorkflowModal,
      toastMessage,
      loginAdmin,
      loginStaffMember,
      logout,
      addBranch,
      updateBranch,
      addProduct,
      updateProduct,
      updateBranchStock,
      restockMultipleItems,
      createBill,
      addStaff,
      updateStaff,
      getLowStockAlerts,
      getStockForBranch,
      getProductStockAtBranch,
      showToast,
      clearToast,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
