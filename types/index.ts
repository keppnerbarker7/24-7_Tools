// Database model types
export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
};

export type Tool = {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  dailyRate: number;
  depositAmount: number;
  imageUrl: string | null;
  igloohomeLockId: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
};

export type User = {
  id: string;
  email: string;
  role: "customer" | "admin";
  createdAt: Date;
};

export type Booking = {
  id: string;
  toolId: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  rentalStartDate: Date;
  rentalEndDate: Date;
  totalAmount: number;
  rentalFee: number;
  depositAmount: number;
  accessCode: string | null;
  status: "pending" | "confirmed" | "pending_code" | "completed" | "cancelled";
  paymentIntentId: string | null;
  trafficSource: string | null;
  fbListingId: string | null;
  emailSentAt: Date | null;
  reminderSentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tool?: Tool;
  user?: User;
};

export type PaymentIntent = {
  id: string;
  stripeIntentId: string;
  amount: number;
  status: "pending" | "succeeded" | "failed";
  bookingId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Form types
export type CreateToolInput = {
  name: string;
  description: string;
  categoryId: string;
  dailyRate: number;
  depositAmount: number;
  image?: File;
  igloohomeLockId?: string;
};

export type UpdateToolInput = Partial<CreateToolInput> & {
  id: string;
  isFeatured?: boolean;
  isActive?: boolean;
};

// API response types
export type ToolWithCategory = Tool & {
  category: Category;
};

export type BookingWithDetails = Booking & {
  tool: Tool;
  user?: User;
};
