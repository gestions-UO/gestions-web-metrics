import { pgTable, uuid, varchar, timestamp, pgEnum, integer } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['owner', 'admin', 'member', 'viewer']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  passwordHash: varchar('password_hash', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userOrganizations = pgTable('user_organizations', {
  userId: uuid('user_id').references(() => users.id).notNull(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  role: roleEnum('role').default('member').notNull(),
});

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  domain: varchar('domain', { length: 255 }).notNull(),
  domainRating: integer('domain_rating').default(0),
  organicTraffic: integer('organic_traffic').default(0),
  backlinksCount: integer('backlinks_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const keywords = pgTable('keywords', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  term: varchar('term', { length: 255 }).notNull(),
  position: integer('position').default(0),
  volume: integer('volume').default(0),
  kd: integer('kd').default(0), // Keyword Difficulty
  url: varchar('url', { length: 500 }),
});
