export type NotificationStatus =
  | 'NE_CREATED' | 'NE_PROCESSING' | 'NE_PROCESSED' | 'NE_FAILED'
  | 'NE_SENDING'  | 'NE_SENT'       | 'NE_INITIALIZED' | 'NE_UNDER_PROCESSING'
  | 'NE_ROUTED'   | 'NE_SUCCESS'    | 'NE_RETRY'       | 'NE_PARTIALLY_FAILED' | 'NE_PENDING';

export type Channel = 'SMS' | 'EMAIL' | 'PUSH';
export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN';

export interface NotificationRow {
  id: string;
  notificationCode: string;
  eventId: string;
  requestId: string;
  messageId: string | null;
  businessReference: string | null;
  channel: Channel;
  status: NotificationStatus;
  recipient: string;
  createdAt: string;
  updatedAt: string;
  retryCount: number;
  provider: { id: string; name: string } | null;
  consumerChannel: { id: string; name: string } | null;
}

export interface NotificationDetail extends NotificationRow {
  payload: unknown;
  metadata: unknown;
  errorDetails: string | null;
  providerResponse: unknown;
  sentAt: string | null;
  statusHistory: StatusHistoryEntry[];
  retryAttempts: RetryAttempt[];
}

export interface StatusHistoryEntry {
  id: string;
  status: NotificationStatus;
  message: string | null;
  createdAt: string;
}

export interface RetryAttempt {
  id: string;
  attemptNumber: number;
  status: string;
  errorDetails: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface PaginatedNotifications {
  items: NotificationRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface NotificationFilter {
  page?: number;
  pageSize?: number;
  status?: string;
  channel?: string;
  providerId?: string;
  requestId?: string;
  eventId?: string;
  messageId?: string;
}
