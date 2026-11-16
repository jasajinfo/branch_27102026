CREATE TABLE "ProcessedEvent" (
    "eventId" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProcessedEvent_pkey" PRIMARY KEY ("eventId")
);

CREATE TABLE "NotificationRecord" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "total" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NotificationRecord_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NotificationRecord_eventId_key" ON "NotificationRecord"("eventId");
