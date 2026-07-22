CREATE TABLE "analytics_events" (
    "id" UUID NOT NULL,
    "session_hash" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "target" TEXT,
    "referrer" TEXT,
    "metadata" JSONB,
    "ip_hash" TEXT,
    "user_agent_hash" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events"("created_at");
CREATE INDEX "analytics_events_event_type_created_at_idx" ON "analytics_events"("event_type", "created_at");
CREATE INDEX "analytics_events_path_created_at_idx" ON "analytics_events"("path", "created_at");
