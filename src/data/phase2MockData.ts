// Phase 2: System Configuration & UI Components - Mock Data

export interface StoreConfiguration {
  storeInfo: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
    website: string;
    businessHours: string;
    fflNumber: string;
    logo?: string;
  };
  taxSettings: {
    defaultTaxRate: number;
    stateTaxRate: number;
    localTaxRate: number;
    taxExemptCategories: string[];
    taxReporting: string;
  };
  businessRules: {
    maxDiscountCashier: number;
    maxDiscountManager: number;
    returnPolicyDays: number;
    requireManagerVoid: number;
    maxRefundWithoutReceipt: number;
    allowNegativeInventory: boolean;
    requireCustomerForSales: boolean;
  };
  receiptSettings: {
    headerText: string;
    footerText: string;
    showLogo: boolean;
    printCustomerCopy: boolean;
    printMerchantCopy: boolean;
    paperSize: string;
  };
}

export interface FileManagementData {
  productImages: {
    id: number;
    name: string;
    size: string;
    uploadDate: string;
    category: string;
    url: string;
    status: 'active' | 'processing' | 'error';
  }[];
  importTemplates: {
    id: number;
    name: string;
    format: string;
    description: string;
    downloadUrl: string;
    lastUpdated: string;
  }[];
  recentBackups: {
    id: number;
    date: string;
    size: string;
    type: 'automatic' | 'manual';
    status: 'success' | 'failed' | 'in-progress';
    downloadUrl?: string;
  }[];
  recentImports: {
    id: number;
    fileName: string;
    type: 'products' | 'customers' | 'inventory';
    date: string;
    recordsProcessed: number;
    status: 'success' | 'failed' | 'partial';
    errors?: string[];
  }[];
}

export interface UIComponentConfig {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };
  layout: {
    sidebarWidth: number;
    headerHeight: number;
    contentPadding: number;
    cardRadius: number;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    headingSize: string;
  };
}

// Mock Data
export const mockStoreConfig: StoreConfiguration = {
  storeInfo: {
    name: "OneStep Gun & Sporting Goods",
    address: "1234 Main Street",
    city: "Dallas", 
    state: "TX",
    zipCode: "75201",
    phone: "(555) 123-4567",
    email: "info@onestepgunstore.com",
    website: "www.onestepgunstore.com",
    businessHours: "Mon-Fri: 9:00 AM - 7:00 PM, Sat: 9:00 AM - 5:00 PM, Sun: Closed",
    fflNumber: "1-12-345-67-8A-12345"
  },
  taxSettings: {
    defaultTaxRate: 8.25,
    stateTaxRate: 6.25,
    localTaxRate: 2.00,
    taxExemptCategories: ["Firearms", "Ammunition", "Law Enforcement"],
    taxReporting: "monthly"
  },
  businessRules: {
    maxDiscountCashier: 15.0,
    maxDiscountManager: 50.0,
    returnPolicyDays: 30,
    requireManagerVoid: 100.00,
    maxRefundWithoutReceipt: 50.00,
    allowNegativeInventory: false,
    requireCustomerForSales: true
  },
  receiptSettings: {
    headerText: "OneStep Gun & Sporting Goods\nYour Trusted Firearms Dealer",
    footerText: "Thank you for your business!\nVisit us online: www.onestepgunstore.com",
    showLogo: true,
    printCustomerCopy: true,
    printMerchantCopy: true,
    paperSize: "80mm"
  }
};

export const mockFileManagement: FileManagementData = {
  productImages: [
    {
      id: 1,
      name: "glock-19-gen5.jpg",
      size: "245 KB",
      uploadDate: "2024-01-15T10:30:00Z",
      category: "Handguns",
      url: "/images/products/glock-19-gen5.jpg",
      status: "active"
    },
    {
      id: 2,
      name: "ar15-smith-wesson.jpg", 
      size: "312 KB",
      uploadDate: "2024-01-14T15:45:00Z",
      category: "Rifles",
      url: "/images/products/ar15-smith-wesson.jpg",
      status: "active"
    },
    {
      id: 3,
      name: "ammo-9mm-federal.jpg",
      size: "156 KB", 
      uploadDate: "2024-01-13T09:15:00Z",
      category: "Ammunition",
      url: "/images/products/ammo-9mm-federal.jpg",
      status: "active"
    },
    {
      id: 4,
      name: "holster-leather-brown.jpg",
      size: "189 KB",
      uploadDate: "2024-01-12T14:20:00Z", 
      category: "Accessories",
      url: "/images/products/holster-leather-brown.jpg",
      status: "processing"
    }
  ],
  importTemplates: [
    {
      id: 1,
      name: "Product Import Template",
      format: "CSV",
      description: "Import products with pricing, categories, and inventory",
      downloadUrl: "/templates/product-import-template.csv",
      lastUpdated: "2024-01-10T12:00:00Z"
    },
    {
      id: 2,
      name: "Customer Import Template", 
      format: "Excel",
      description: "Import customer database with contact information",
      downloadUrl: "/templates/customer-import-template.xlsx",
      lastUpdated: "2024-01-10T12:00:00Z"
    },
    {
      id: 3,
      name: "Inventory Adjustment Template",
      format: "CSV", 
      description: "Bulk inventory quantity updates and adjustments",
      downloadUrl: "/templates/inventory-adjustment-template.csv",
      lastUpdated: "2024-01-10T12:00:00Z"
    },
    {
      id: 4,
      name: "Vendor Import Template",
      format: "CSV",
      description: "Import vendor information and contact details",
      downloadUrl: "/templates/vendor-import-template.csv", 
      lastUpdated: "2024-01-10T12:00:00Z"
    }
  ],
  recentBackups: [
    {
      id: 1,
      date: "2024-01-15T02:00:00Z",
      size: "45.2 MB",
      type: "automatic",
      status: "success",
      downloadUrl: "/backups/backup-2024-01-15.zip"
    },
    {
      id: 2,
      date: "2024-01-14T02:00:00Z", 
      size: "44.8 MB",
      type: "automatic",
      status: "success",
      downloadUrl: "/backups/backup-2024-01-14.zip"
    },
    {
      id: 3,
      date: "2024-01-13T02:00:00Z",
      size: "44.1 MB", 
      type: "automatic",
      status: "success",
      downloadUrl: "/backups/backup-2024-01-13.zip"
    },
    {
      id: 4,
      date: "2024-01-12T16:30:00Z",
      size: "43.9 MB",
      type: "manual",
      status: "success",
      downloadUrl: "/backups/backup-2024-01-12-manual.zip"
    }
  ],
  recentImports: [
    {
      id: 1,
      fileName: "new-products-jan-2024.csv",
      type: "products",
      date: "2024-01-14T11:30:00Z",
      recordsProcessed: 156,
      status: "success"
    },
    {
      id: 2,
      fileName: "customer-update-list.xlsx", 
      type: "customers",
      date: "2024-01-13T14:15:00Z",
      recordsProcessed: 89,
      status: "partial",
      errors: ["Invalid email format in row 23", "Missing phone number in row 45"]
    },
    {
      id: 3,
      fileName: "inventory-count-adjustment.csv",
      type: "inventory", 
      date: "2024-01-12T09:45:00Z",
      recordsProcessed: 234,
      status: "success"
    }
  ]
};

export const mockUIConfig: UIComponentConfig = {
  theme: {
    primaryColor: "#3B82F6",
    secondaryColor: "#8B5CF6", 
    accentColor: "#10B981",
    backgroundColor: "#F9FAFB"
  },
  layout: {
    sidebarWidth: 256,
    headerHeight: 64,
    contentPadding: 24,
    cardRadius: 12
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "14px",
    headingSize: "18px"
  }
};

// Phase 2 Specific Data Types
export interface SystemAlert {
  id: number;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const mockSystemAlerts: SystemAlert[] = [
  {
    id: 1,
    type: "warning",
    title: "Low Stock Alert",
    message: "5 products are below reorder point",
    timestamp: "2024-01-15T10:30:00Z",
    read: false
  },
  {
    id: 2,
    type: "info",
    title: "Backup Completed",
    message: "Daily backup completed successfully",
    timestamp: "2024-01-15T02:00:00Z", 
    read: true
  },
  {
    id: 3,
    type: "success",
    title: "Import Completed",
    message: "Product import processed 156 items successfully",
    timestamp: "2024-01-14T11:30:00Z",
    read: true
  }
];
