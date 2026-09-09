# Mentis Disaster Recovery Runbook & Backup Verification

## 1. Backup Strategy Overview
- **Database Snapshots**: Supabase automated daily point-in-time recovery (PITR) with 7-day retention.
- **Storage Buckets**: Asset backups replicated across regional CDN availability zones (`ap-southeast-1`).
- **Manual Backups**: Admin Panel manual trigger under `/admin/settings` -> Backups tab.

## 2. Restore Test Procedure
1. Navigate to Supabase Dashboard -> Database -> Backups.
2. Select target PITR timestamp or latest snapshot `bak-20260807`.
3. Restore database instance to a staging environment (`staging-mentis-db`).
4. Verify RLS policies and table row counts (`profiles`, `modules`, `lessons`, `questions`).
5. Execute health check API `GET /admin/settings` to verify configuration integrity.

## 3. Recovery Time Objective (RTO) & Recovery Point Objective (RPO)
- **Target RTO**: < 30 minutes.
- **Target RPO**: < 1 hour.
