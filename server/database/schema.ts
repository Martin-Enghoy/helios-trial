import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Enums
 */
export const APPLICATION_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "approved",
  "cancelled"
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const NOTICE_PERIODS = [
  "immediate",
  "2_weeks",
  "1_month",
  "2_months",
  "3_months",  
] as const;

export type NoticePeriod = (typeof NOTICE_PERIODS)[number];


/**
 * Human-readable Labels
 */
export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  approved: "Approved",
  cancelled: "Cancelled",
};

export const NOTICE_PERIOD_LABELS: Record<NoticePeriod, string> = {
  immediate: "Immediate",
  "2_weeks": "2 Weeks",
  "1_month": "1 Month",
  "2_months": "2 Months",
  "3_months": "3 Months",
};


/**
 * Schemas
 */

// Applications Table
export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  name: text("name").notNull(),
  currentWork: text("current_work").notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  noticePeriod: text("notice_period", {
    enum: NOTICE_PERIODS,
  }).notNull(),
  expectedSalary: integer("expected_salary").notNull(),
  
  status: text("status", {
    enum: APPLICATION_STATUSES,
  })
    .notNull()
    .default("new"),
  
  createdAt: text('created_at')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

/**
 * Inferred Types
 */

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;