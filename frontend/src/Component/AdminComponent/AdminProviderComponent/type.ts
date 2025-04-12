export interface Shop {
  id: number;
  name: string;
  registrationCertificateImages: string ; // To handle single or multiple images
  citizenIdentificationCard: string;
  shopType: "ENTERPRISE" | "OTHER"; // Extend for other possible types
  active: boolean;
  close: boolean;
  totalFeeDueAmount: number;
  manager: {
    id: number;
    name: string;
    email: string;
    active: boolean;
    roles: {
      id: number;
      name: string;
    }[];
    userType: string;
    resetToken: string;
    createdAt: string; // ISO format timestamp
    updatedAt: string;
    delete: boolean;
  };
  address: {
    id: number;
    recipientName: string;
    phone: string;
    provinceId: string;
    districtId: string;
    wardId: string;
    province: string;
    district: string;
    ward: string;
    postalCode: string;
    address: string;
    defaultAddress: boolean;
    createdBy: number;
    updatedBy: number;
    createdAt: string; // ISO format timestamp
    updatedAt: string;
    delete: boolean;
  };
  tin: string;
  updatedBy: number;
  updatedAt: string; // ISO format timestamp
  delete: boolean;
}

export interface PaginationState {
  activePage: number;
  inactivePage: number;
  itemsPerPage: number;
  activeTotalPages?: number;
  inactiveTotalPages?: number;
}
