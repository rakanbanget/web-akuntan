import React, { createContext, useState, useEffect } from 'react';
import {
  initialProducts,
  initialContacts,
  initialInvoices,
  initialExpenses,
  initialBankAccounts,
  initialChartOfAccounts,
  initialFixedAssets,
  initialEmployees,
  initialLeads,
  initialEMeteraiLogs,
  initialReferrals,
} from '../utils/mockData';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme & Navigation
  const [theme, setTheme] = useState(() => localStorage.getItem('akuntanku_theme') || 'light');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Core Data Lists
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('akuntanku_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('akuntanku_contacts');
    return saved ? JSON.parse(saved) : initialContacts;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('akuntanku_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('akuntanku_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [bankAccounts, setBankAccounts] = useState(() => {
    const saved = localStorage.getItem('akuntanku_bankAccounts');
    return saved ? JSON.parse(saved) : initialBankAccounts;
  });

  const [coa, setCoa] = useState(() => {
    const saved = localStorage.getItem('akuntanku_coa');
    return saved ? JSON.parse(saved) : initialChartOfAccounts;
  });

  const [fixedAssets, setFixedAssets] = useState(() => {
    const saved = localStorage.getItem('akuntanku_fixedAssets');
    return saved ? JSON.parse(saved) : initialFixedAssets;
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('akuntanku_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('akuntanku_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [eMeteraiLogs, setEMeteraiLogs] = useState(() => {
    const saved = localStorage.getItem('akuntanku_eMeteraiLogs');
    return saved ? JSON.parse(saved) : initialEMeteraiLogs;
  });

  const [referrals, setReferrals] = useState(() => {
    const saved = localStorage.getItem('akuntanku_referrals');
    return saved ? JSON.parse(saved) : initialReferrals;
  });

  // Settings
  const [companyProfile, setCompanyProfile] = useState(() => {
    const saved = localStorage.getItem('akuntanku_company');
    return saved ? JSON.parse(saved) : {
      name: 'PT Jasa Jaya Solusindo',
      address: 'Gedung Cyber Lt. 5, Jl. Kuningan Barat No. 8, Jakarta Selatan',
      phone: '021-9988776',
      taxRate: 11,
      currency: 'Rp',
    };
  });

  // Save to LocalStorage when states change
  useEffect(() => {
    localStorage.setItem('akuntanku_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('akuntanku_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('akuntanku_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('akuntanku_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('akuntanku_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('akuntanku_bankAccounts', JSON.stringify(bankAccounts));
  }, [bankAccounts]);

  useEffect(() => {
    localStorage.setItem('akuntanku_coa', JSON.stringify(coa));
  }, [coa]);

  useEffect(() => {
    localStorage.setItem('akuntanku_fixedAssets', JSON.stringify(fixedAssets));
  }, [fixedAssets]);

  useEffect(() => {
    localStorage.setItem('akuntanku_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('akuntanku_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('akuntanku_eMeteraiLogs', JSON.stringify(eMeteraiLogs));
  }, [eMeteraiLogs]);

  useEffect(() => {
    localStorage.setItem('akuntanku_referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem('akuntanku_company', JSON.stringify(companyProfile));
  }, [companyProfile]);

  // Operations Helpers
  const addInvoice = (invoice) => {
    setInvoices([invoice, ...invoices]);
    // update inventory stock if product IDs match
    invoice.items.forEach(item => {
      setProducts(prev => prev.map(p => {
        if (p.id === item.productId) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
        return p;
      }));
    });
    // add to revenue COA
    setCoa(prev => prev.map(acc => {
      if (acc.code === '4-101') { // Revenue account
        return { ...acc, balance: acc.balance + invoice.subtotal };
      }
      if (acc.code === '1-104') { // Accounts Receivable
        if (invoice.status !== 'Lunas') {
          return { ...acc, balance: acc.balance + invoice.total };
        }
      }
      if (acc.code === '1-102' && invoice.status === 'Lunas') { // Bank BCA (assuming paid to BCA)
        return { ...acc, balance: acc.balance + invoice.total };
      }
      if (acc.code === '2-102') { // Tax Liability
        return { ...acc, balance: acc.balance + invoice.tax };
      }
      return acc;
    }));
    // Add to bank balance if paid
    if (invoice.status === 'Lunas') {
      setBankAccounts(prev => prev.map(acc => {
        if (acc.id === 'ACC-02') { // Bank BCA
          return { ...acc, balance: acc.balance + invoice.total };
        }
        return acc;
      }));
    }
  };

  const payInvoice = (invoiceId) => {
    let paidAmount = 0;
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId && inv.status !== 'Lunas') {
        paidAmount = inv.total;
        return { ...inv, status: 'Lunas' };
      }
      return inv;
    }));

    if (paidAmount > 0) {
      setBankAccounts(prev => prev.map(acc => {
        if (acc.id === 'ACC-02') { // Bank BCA
          return { ...acc, balance: acc.balance + paidAmount };
        }
        return acc;
      }));
      setCoa(prev => prev.map(acc => {
        if (acc.code === '1-104') { // Accounts Receivable decreases
          return { ...acc, balance: Math.max(0, acc.balance - paidAmount) };
        }
        if (acc.code === '1-102') { // Bank BCA increases
          return { ...acc, balance: acc.balance + paidAmount };
        }
        return acc;
      }));
    }
  };

  const addExpense = (expense) => {
    setExpenses([expense, ...expenses]);
    // Deduct from bank account
    setBankAccounts(prev => prev.map(acc => {
      if (acc.id === 'ACC-02') { // Deduct from Bank BCA for simulation simplicity
        return { ...acc, balance: Math.max(0, acc.balance - expense.amount) };
      }
      return acc;
    }));
    // Increase expense COA
    setCoa(prev => prev.map(acc => {
      if (acc.name.toLowerCase().includes(expense.category.toLowerCase()) || acc.code === '1-102') {
        if (acc.code === '1-102') { // Bank BCA decreases
          return { ...acc, balance: Math.max(0, acc.balance - expense.amount) };
        } else { // Expense increases
          return { ...acc, balance: acc.balance + expense.amount };
        }
      }
      return acc;
    }));
  };

  const addProduct = (product) => {
    setProducts([...products, product]);
  };

  const updateProductStock = (productId, newStock) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
  };

  const addContact = (contact) => {
    setContacts([...contacts, contact]);
  };

  const addFixedAsset = (asset) => {
    setFixedAssets([...fixedAssets, asset]);
    // Deduct from cash/bank
    setBankAccounts(prev => prev.map(acc => {
      if (acc.id === 'ACC-02') {
        return { ...acc, balance: Math.max(0, acc.balance - asset.cost) };
      }
      return acc;
    }));
    // Add to COA
    setCoa(prev => prev.map(acc => {
      if (acc.code === '1-202' && asset.category === 'Peralatan Kantor') {
        return { ...acc, balance: acc.balance + asset.cost };
      }
      if (acc.code === '1-201' && asset.category === 'Kendaraan') {
        return { ...acc, balance: acc.balance + asset.cost };
      }
      if (acc.code === '1-102') { // BCA goes down
        return { ...acc, balance: Math.max(0, acc.balance - asset.cost) };
      }
      return acc;
    }));
  };

  const addLead = (lead) => {
    setLeads([...leads, lead]);
  };

  const updateLeadStatus = (leadId, newStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  const addEMeteraiLog = (log) => {
    setEMeteraiLogs([log, ...eMeteraiLogs]);
  };

  const addReferral = (refObj) => {
    setReferrals([refObj, ...referrals]);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      activeTab,
      setActiveTab,
      sidebarOpen,
      setSidebarOpen,
      products,
      setProducts,
      contacts,
      setContacts,
      invoices,
      setInvoices,
      expenses,
      setExpenses,
      bankAccounts,
      setBankAccounts,
      coa,
      setCoa,
      fixedAssets,
      setFixedAssets,
      employees,
      setEmployees,
      leads,
      setLeads,
      eMeteraiLogs,
      setEMeteraiLogs,
      referrals,
      setReferrals,
      companyProfile,
      setCompanyProfile,
      addInvoice,
      payInvoice,
      addExpense,
      addProduct,
      updateProductStock,
      addContact,
      addFixedAsset,
      addLead,
      updateLeadStatus,
      addEMeteraiLog,
      addReferral
    }}>
      {children}
    </AppContext.Provider>
  );
};
