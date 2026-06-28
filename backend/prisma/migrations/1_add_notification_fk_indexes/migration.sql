-- Add indexes on foreign-key columns used for filtering (P3-S1, P3-S2)
CREATE INDEX "notifications_providerId_idx" ON "notifications"("providerId");
CREATE INDEX "notifications_consumerChannelId_idx" ON "notifications"("consumerChannelId");
