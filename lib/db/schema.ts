import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').notNull().unique(), 
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const chatHistory = pgTable('chat_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  messages: jsonb('messages').notNull(), 
  createdAt: timestamp('created_at').defaultNow(),
});