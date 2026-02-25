import { pgTable, text, timestamp, uuid, jsonb, unique, integer } from 'drizzle-orm/pg-core';

export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(), 
  key: text('key').notNull(), 
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  unq: unique().on(table.userId, table.key),
}));

export const chatHistory = pgTable('chat_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  messages: jsonb('messages').notNull(), 
  createdAt: timestamp('created_at').defaultNow(),
});

export const messageFeedback = pgTable('message_feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  messageId: text('message_id').notNull(), // ID del mensaje del AI SDK
  rating: text('rating').notNull(), // 👍 o 👎 
  createdAt: timestamp('created_at').defaultNow(),
});

export const genres = pgTable('genres', {
  id: integer('id').primaryKey(), 
  name: text('name').notNull(),
});