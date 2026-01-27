export interface CashRequest {
  _id: string;
  requestId: string;
  dateOfRequest: string;
  requestingOfficer: string;
  position: string;
  department: string;
  purposeOfExpense: string;
  amountRequested: number;
  paymentDay: 'Wednesday' | 'Friday';
  supportingDocuments: {
    invoice: boolean;
    quotation: boolean;
    bill: boolean;
    proforma: boolean;
    other: string;
  };
  operationalJustification: string;
  impactIfNotApproved: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: {
    approverName: string;
    approvedAt: string;
    comment?: string;
  };
  rejectedBy?: {
    approverName: string;
    rejectedAt: string;
    reason: string;
  };
  createdAt: string;
}

export interface Approver {
  _id: string;
  name: string;
  phone: string;
  position: string;
  isActive: boolean;
}
