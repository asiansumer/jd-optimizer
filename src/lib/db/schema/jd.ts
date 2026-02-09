import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// SQLite boolean type helper
const integer = (name: string) => int(name);

export const jds = sqliteTable(
  'jds',
  {
    id: int('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: int('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => ({
    userIdIdx: index('jds_user_id_idx').on(table.userId),
  })
);

export const jdTemplates = sqliteTable(
  'jd_templates',
  {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    category: text('category').notNull(),
    content: text('content').notNull(),
    isPublic: integer('is_public').notNull().default(0),
    createdAt: int('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: int('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => ({
    categoryIdx: index('jd_templates_category_idx').on(table.category),
    isPublicIdx: index('jd_templates_is_public_idx').on(table.isPublic),
  })
);

// Types
export type JD = typeof jds.$inferSelect;
export type NewJD = typeof jds.$inferInsert;
export type JDTemplate = typeof jdTemplates.$inferSelect;
export type NewJDTemplate = typeof jdTemplates.$inferInsert;
