import {
  integer,
  pgTable,
  varchar,
  text,
  json,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer(),
});

export const SessionTable = pgTable("sessions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar({ length: 255 }).notNull().unique(),
  notes: text(),
  conversation: json(),
  report: json(),
  createdBy: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});
