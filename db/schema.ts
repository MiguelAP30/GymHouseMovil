import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
    id: integer("id").primaryKey({autoIncrement: true}),
    name: text("name").notNull(),
    list_id: integer("list_id").notNull().references(() => lists.id),
})

export const lists = sqliteTable("lists", {
    id: integer("id").primaryKey({autoIncrement: true}),
    name: text("name").notNull(),
})

export const exercises = sqliteTable("exercises", {
    id: integer("id").primaryKey({autoIncrement: true}),
    name: text("name").notNull(),
    description: text("description").notNull(),
    dateAdded: text("dateAdded").notNull(),
    dificulty_id: integer("dificulty_id").notNull().references(() => difficulties.id),
    image: text("image").notNull(),
    machine_id: integer("machine_id").notNull().references(() => machines.id),
    video: text("video").notNull(),
});

export const difficulties = sqliteTable("difficulties", {
    id: integer("id").primaryKey({autoIncrement: true}),
    name: text("name").notNull(),
});

export const machines = sqliteTable("machines", {
    id: integer("id").primaryKey({autoIncrement: true}),
    name: text("name").notNull(),
    description: text("description").notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type Difficulty = typeof difficulties.$inferSelect;
export type Machine = typeof machines.$inferSelect;