import { pgTable, uuid, varchar, timestamp,text,primaryKey,uniqueIndex } from "drizzle-orm/pg-core";

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  applicationId: uuid("applicationId").references(() => applications.id),
  password: varchar("password", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (users) => {
    return {
        //composite primary key is email and application id
        cpk : primaryKey(users.email,users.applicationId),
        //unique Index because our users doesn't have any unique id
        idIndex: uniqueIndex("users_id_index").on(users.id),
    }
});


export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  applicationId: uuid("applicationId").references(() => applications.id),
  permissions: text("permissions").array().$type<Array<string>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (roles) => {
    return {
        //composite primary key is email and application id
        cpk : primaryKey(roles.name,roles.applicationId),
        //unique Index because our roles doesn't have any unique id
        idIndex: uniqueIndex("roles_id_index").on(roles.id),
    }
});

//join table for assignging roles/users to applications
export const usersToRoles = pgTable("usersToRoles", {
  applicationId: uuid("applicationId").references(() => applications.id).notNull(),
  roleId: uuid("roleId").references(() => roles.id).notNull(),
  userId: uuid("userId").references(() => users.id).notNull(),
},(userToRoles)=> {
  return {
    //application,role and user id should be unique
    cpk : primaryKey(userToRoles.applicationId,userToRoles.roleId,userToRoles.userId),
  }
})
