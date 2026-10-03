
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/wasm.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.19.0
 * Query Engine version: 5fe21811a6ba0b952a3bc71400666511fe3b902f
 */
Prisma.prismaVersion = {
  client: "5.19.0",
  engine: "5fe21811a6ba0b952a3bc71400666511fe3b902f"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  username: 'username',
  passwordHash: 'passwordHash',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserProfileScalarFieldEnum = {
  userId: 'userId',
  firstName: 'firstName',
  lastName: 'lastName',
  identification: 'identification',
  phone: 'phone',
  facebookUrl: 'facebookUrl',
  instagramUrl: 'instagramUrl',
  linkedinUrl: 'linkedinUrl',
  xUrl: 'xUrl',
  githubUrl: 'githubUrl',
  tiktokUrl: 'tiktokUrl',
  websiteUrl: 'websiteUrl',
  avatarData: 'avatarData',
  avatarMimeType: 'avatarMimeType',
  avatarUpdatedAt: 'avatarUpdatedAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuthAccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  provider: 'provider',
  providerAccountId: 'providerAccountId'
};

exports.Prisma.UserSessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  sealedTokens: 'sealedTokens',
  expiresAt: 'expiresAt',
  revokedAt: 'revokedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  description: 'description',
  status: 'status',
  priority: 'priority',
  dueDate: 'dueDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AlertScalarFieldEnum = {
  id: 'id',
  taskId: 'taskId',
  scheduledTime: 'scheduledTime',
  sent: 'sent',
  createdAt: 'createdAt'
};

exports.Prisma.StudyTimeLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  startTime: 'startTime',
  durationMinutes: 'durationMinutes',
  sessionType: 'sessionType',
  createdAt: 'createdAt'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  code: 'code',
  name: 'name',
  normalizedName: 'normalizedName',
  description: 'description',
  isSystem: 'isSystem',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  module: 'module',
  action: 'action',
  code: 'code',
  description: 'description',
  createdAt: 'createdAt'
};

exports.Prisma.RolePermissionScalarFieldEnum = {
  roleId: 'roleId',
  permissionId: 'permissionId',
  granted: 'granted'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  roleId: 'roleId'
};

exports.Prisma.MenuScalarFieldEnum = {
  id: 'id',
  parentId: 'parentId',
  code: 'code',
  name: 'name',
  route: 'route'
};

exports.Prisma.MenuPermissionScalarFieldEnum = {
  menuId: 'menuId',
  permissionId: 'permissionId'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  actorUserId: 'actorUserId',
  entityType: 'entityType',
  entityId: 'entityId',
  action: 'action',
  changes: 'changes',
  createdAt: 'createdAt'
};

exports.Prisma.InstitutionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  description: 'description',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.CampusScalarFieldEnum = {
  id: 'id',
  institutionId: 'institutionId',
  name: 'name',
  code: 'code',
  address: 'address',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.CourseScalarFieldEnum = {
  id: 'id',
  institutionId: 'institutionId',
  code: 'code',
  title: 'title',
  description: 'description',
  credits: 'credits',
  semester: 'semester',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.SectionScalarFieldEnum = {
  id: 'id',
  courseId: 'courseId',
  name: 'name',
  description: 'description',
  classroom: 'classroom',
  schedule: 'schedule',
  capacity: 'capacity',
  expectedUpdatedAt: 'expectedUpdatedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MaterialScalarFieldEnum = {
  id: 'id',
  sectionId: 'sectionId',
  title: 'title',
  type: 'type',
  url: 'url',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StudySessionScalarFieldEnum = {
  id: 'id',
  courseId: 'courseId',
  status: 'status',
  startsAt: 'startsAt',
  endsAt: 'endsAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StudySessionBookingScalarFieldEnum = {
  id: 'id',
  studySessionId: 'studySessionId',
  userId: 'userId',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.AuditAction = exports.$Enums.AuditAction = {
  TASK_CREATED: 'TASK_CREATED',
  TASK_UPDATED: 'TASK_UPDATED',
  TASK_DELETED: 'TASK_DELETED',
  USER_LOGGED_IN: 'USER_LOGGED_IN'
};

exports.Prisma.ModelName = {
  User: 'User',
  UserProfile: 'UserProfile',
  AuthAccount: 'AuthAccount',
  UserSession: 'UserSession',
  Task: 'Task',
  Alert: 'Alert',
  StudyTimeLog: 'StudyTimeLog',
  Role: 'Role',
  Permission: 'Permission',
  RolePermission: 'RolePermission',
  UserRole: 'UserRole',
  Menu: 'Menu',
  MenuPermission: 'MenuPermission',
  AuditLog: 'AuditLog',
  Institution: 'Institution',
  Campus: 'Campus',
  Course: 'Course',
  Section: 'Section',
  Material: 'Material',
  StudySession: 'StudySession',
  StudySessionBooking: 'StudySessionBooking'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Estudio App Proyecto\\estudioapp\\src\\generated\\prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [
      "driverAdapters"
    ],
    "sourceFilePath": "C:\\Estudio App Proyecto\\estudioapp\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.19.0",
  "engineVersion": "5fe21811a6ba0b952a3bc71400666511fe3b902f",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\ngenerator client {\n  provider        = \"prisma-client-js\"\n  output          = \"../src/generated/prisma\"\n  previewFeatures = [\"driverAdapters\"]\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// ==========================================\n// MÓDULO DE USUARIOS Y AUTENTICACIÓN\n// ==========================================\n\nmodel User {\n  id           String   @id @default(uuid()) @db.Uuid\n  email        String   @unique @db.VarChar(180)\n  username     String?  @unique @db.VarChar(100)\n  passwordHash String?  @map(\"password_hash\")\n  status       String   @db.VarChar(30)\n  createdAt    DateTime @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt    DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz\n\n  profile              UserProfile?\n  authAccounts         AuthAccount[]\n  sessions             UserSession[]\n  userRoles            UserRole[]\n  tasks                Task[]\n  studyTimeLogs        StudyTimeLog[]\n  auditLogs            AuditLog[]\n  studySessionBookings StudySessionBooking[]\n\n  @@map(\"users\")\n}\n\nmodel UserProfile {\n  userId         String  @id @map(\"user_id\") @db.Uuid\n  firstName      String  @map(\"first_name\") @db.VarChar(100)\n  lastName       String  @map(\"last_name\") @db.VarChar(100)\n  identification String? @db.VarChar(30)\n  phone          String? @db.VarChar(16)\n\n  facebookUrl  String? @map(\"facebook_url\") @db.VarChar(255)\n  instagramUrl String? @map(\"instagram_url\") @db.VarChar(255)\n  linkedinUrl  String? @map(\"linkedin_url\") @db.VarChar(255)\n  xUrl         String? @map(\"x_url\") @db.VarChar(255)\n  githubUrl    String? @map(\"github_url\") @db.VarChar(255)\n  tiktokUrl    String? @map(\"tiktok_url\") @db.VarChar(255)\n  websiteUrl   String? @map(\"website_url\") @db.VarChar(255)\n\n  avatarData      Bytes?    @map(\"avatar_data\")\n  avatarMimeType  String?   @map(\"avatar_mime_type\") @db.VarChar(30)\n  avatarUpdatedAt DateTime? @map(\"avatar_updated_at\") @db.Timestamptz\n  updatedAt       DateTime  @updatedAt @map(\"updated_at\") @db.Timestamptz\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map(\"user_profiles\")\n}\n\nmodel AuthAccount {\n  id                String @id @default(uuid()) @db.Uuid\n  userId            String @map(\"user_id\") @db.Uuid\n  provider          String @db.VarChar(50)\n  providerAccountId String @map(\"provider_account_id\") @db.VarChar(200)\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([provider, providerAccountId])\n  @@index([userId])\n  @@map(\"auth_accounts\")\n}\n\nmodel UserSession {\n  id           String   @id @default(uuid()) @db.Uuid\n  userId       String   @map(\"user_id\") @db.Uuid\n  sealedTokens String   @map(\"sealed_tokens\")\n  expiresAt    DateTime @map(\"expires_at\") @db.Timestamptz\n  revokedAt    DateTime @map(\"revoked_at\") @db.Timestamptz\n  createdAt    DateTime @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt    DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@index([expiresAt])\n  @@map(\"user_sessions\")\n}\n\n// ==========================================\n// MÓDULO DE TAREAS Y ALERTAS (ESTUDIOAPP)\n// ==========================================\n\nmodel Task {\n  id          String    @id @default(uuid()) @db.Uuid\n  userId      String    @map(\"user_id\") @db.Uuid\n  title       String    @db.VarChar(250)\n  description String?\n  status      String    @default(\"PENDING\") @db.VarChar(30)\n  priority    String    @default(\"MEDIUM\") @db.VarChar(10)\n  dueDate     DateTime? @map(\"due_date\") @db.Timestamptz\n  createdAt   DateTime  @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt   DateTime  @updatedAt @map(\"updated_at\") @db.Timestamptz\n\n  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  alerts Alert[]\n\n  @@index([userId])\n  @@map(\"tasks\")\n}\n\nmodel Alert {\n  id            String   @id @default(uuid()) @db.Uuid\n  taskId        String   @map(\"task_id\") @db.Uuid\n  scheduledTime DateTime @map(\"scheduled_time\") @db.Timestamptz\n  sent          Boolean  @default(false)\n  createdAt     DateTime @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  task Task @relation(fields: [taskId], references: [id], onDelete: Cascade)\n\n  @@index([taskId])\n  @@map(\"alerts\")\n}\n\n// ==========================================\n// MÓDULO DE CRONÓMETRO / SESIONES DE ESTUDIO\n// ==========================================\n\nmodel StudyTimeLog {\n  id              String   @id @default(uuid()) @db.Uuid\n  userId          String   @map(\"user_id\") @db.Uuid\n  startTime       DateTime @map(\"start_time\") @db.Timestamptz\n  durationMinutes Int      @map(\"duration_minutes\")\n  sessionType     String   @map(\"session_type\") @db.VarChar(30)\n  createdAt       DateTime @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map(\"study_time_logs\")\n}\n\n// ==========================================\n// MÓDULO DE ROLES, PERMISOS Y MENÚS\n// ==========================================\n\nmodel Role {\n  id             String    @id @default(uuid()) @db.Uuid\n  organizationId String?   @map(\"organization_id\") @db.Uuid\n  code           String    @db.VarChar(100)\n  name           String    @db.VarChar(150)\n  normalizedName String    @map(\"normalized_name\") @db.VarChar(150)\n  description    String?\n  isSystem       Boolean   @default(false) @map(\"is_system\")\n  createdAt      DateTime  @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt      DateTime  @updatedAt @map(\"updated_at\") @db.Timestamptz\n  deletedAt      DateTime? @map(\"deleted_at\") @db.Timestamptz\n\n  permissions RolePermission[]\n  userRoles   UserRole[]\n\n  @@map(\"roles\")\n}\n\nmodel Permission {\n  id          String   @id @default(uuid()) @db.Uuid\n  module      String   @db.VarChar(100)\n  action      String   @db.VarChar(100)\n  code        String   @unique @db.VarChar(200)\n  description String?\n  createdAt   DateTime @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  roles RolePermission[]\n  menus MenuPermission[]\n\n  @@map(\"permissions\")\n}\n\nmodel RolePermission {\n  roleId       String  @map(\"role_id\") @db.Uuid\n  permissionId String  @map(\"permission_id\") @db.Uuid\n  granted      Boolean @default(true)\n\n  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)\n  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)\n\n  @@id([roleId, permissionId])\n  @@map(\"role_permissions\")\n}\n\nmodel UserRole {\n  id     String @id @default(uuid()) @db.Uuid\n  userId String @map(\"user_id\") @db.Uuid\n  roleId String @map(\"role_id\") @db.Uuid\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map(\"user_roles\")\n}\n\nmodel Menu {\n  id       String  @id @default(uuid()) @db.Uuid\n  parentId String? @map(\"parent_id\") @db.Uuid\n  code     String  @unique @db.VarChar(100)\n  name     String  @db.VarChar(150)\n  route    String? @db.VarChar(255)\n\n  parent      Menu?            @relation(\"MenuHierarchy\", fields: [parentId], references: [id], onDelete: SetNull)\n  children    Menu[]           @relation(\"MenuHierarchy\")\n  permissions MenuPermission[]\n\n  @@map(\"menus\")\n}\n\nmodel MenuPermission {\n  menuId       String @map(\"menu_id\") @db.Uuid\n  permissionId String @map(\"permission_id\") @db.Uuid\n\n  menu       Menu       @relation(fields: [menuId], references: [id], onDelete: Cascade)\n  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)\n\n  @@id([menuId, permissionId])\n  @@map(\"menu_permissions\")\n}\n\n// ==========================================\n// MÓDULO DE AUDITORÍA\n// ==========================================\n\nenum AuditAction {\n  TASK_CREATED\n  TASK_UPDATED\n  TASK_DELETED\n  USER_LOGGED_IN\n}\n\nmodel AuditLog {\n  id          String      @id @default(uuid()) @db.Uuid\n  actorUserId String      @map(\"actor_user_id\") @db.Uuid\n  entityType  String      @map(\"entity_type\") @db.VarChar(100)\n  entityId    String      @map(\"entity_id\") @db.Uuid\n  action      AuditAction\n  changes     Json?\n  createdAt   DateTime    @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  actor User @relation(fields: [actorUserId], references: [id], onDelete: Restrict)\n\n  @@index([actorUserId])\n  @@index([entityType, entityId])\n  @@index([createdAt])\n  @@map(\"audit_logs\")\n}\n\n// ==========================================\n// MÓDULO DE INSTITUCIONES Y CAMPUS / CURSOS\n// ==========================================\n\nmodel Institution {\n  id          String    @id @default(uuid()) @db.Uuid\n  name        String    @db.VarChar(150)\n  code        String?   @unique @db.VarChar(50)\n  description String?\n  status      String    @default(\"ACTIVE\") @db.VarChar(30)\n  createdAt   DateTime  @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt   DateTime  @updatedAt @map(\"updated_at\") @db.Timestamptz\n  deletedAt   DateTime? @map(\"deleted_at\") @db.Timestamptz\n\n  campuses Campus[]\n  courses  Course[]\n\n  @@map(\"institutions\")\n}\n\nmodel Campus {\n  id            String    @id @default(uuid()) @db.Uuid\n  institutionId String    @map(\"institution_id\") @db.Uuid\n  name          String    @db.VarChar(150)\n  code          String    @db.VarChar(50)\n  address       String?\n  status        String    @default(\"ACTIVE\") @db.VarChar(30)\n  createdAt     DateTime  @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt     DateTime  @updatedAt @map(\"updated_at\") @db.Timestamptz\n  deletedAt     DateTime? @map(\"deleted_at\") @db.Timestamptz\n\n  institution Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade)\n\n  @@index([institutionId])\n  @@map(\"campuses\")\n}\n\nmodel Course {\n  id            String    @id @default(uuid()) @db.Uuid\n  institutionId String?   @map(\"institution_id\") @db.Uuid\n  code          String    @unique @db.VarChar(50)\n  title         String    @db.VarChar(150)\n  description   String?\n  credits       Int?      @default(0)\n  semester      Int?\n  status        String    @default(\"ACTIVE\") @db.VarChar(30)\n  createdAt     DateTime  @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt     DateTime  @updatedAt @map(\"updated_at\") @db.Timestamptz\n  deletedAt     DateTime? @map(\"deleted_at\") @db.Timestamptz\n\n  institution   Institution?   @relation(fields: [institutionId], references: [id], onDelete: SetNull)\n  sections      Section[]\n  studySessions StudySession[]\n\n  @@index([institutionId])\n  @@map(\"courses\")\n}\n\n// ==========================================\n// MÓDULO DE SECCIONES Y MATERIALES\n// ==========================================\n\nmodel Section {\n  id                String    @id @default(uuid()) @db.Uuid\n  courseId          String    @map(\"course_id\") @db.Uuid\n  name              String    @db.VarChar(150)\n  description       String?\n  classroom         String?   @db.VarChar(100)\n  schedule          String?   @db.VarChar(150)\n  capacity          Int?\n  expectedUpdatedAt DateTime? @map(\"expected_updated_at\") @db.Timestamptz\n  createdAt         DateTime  @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt         DateTime  @updatedAt @map(\"updated_at\") @db.Timestamptz\n\n  course    Course     @relation(fields: [courseId], references: [id], onDelete: Cascade)\n  materials Material[]\n\n  @@index([courseId])\n  @@map(\"sections\")\n}\n\nmodel Material {\n  id        String   @id @default(uuid()) @db.Uuid\n  sectionId String   @map(\"section_id\") @db.Uuid\n  title     String   @db.VarChar(250)\n  type      String   @db.VarChar(50)\n  url       String?\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz\n\n  section Section @relation(fields: [sectionId], references: [id], onDelete: Cascade)\n\n  @@index([sectionId])\n  @@map(\"materials\")\n}\n\n// ==========================================\n// MÓDULO DE CALENDARIO / CLASES\n// ==========================================\n\nmodel StudySession {\n  id        String   @id @default(uuid()) @db.Uuid\n  courseId  String   @map(\"course_id\") @db.Uuid\n  status    String   @default(\"PUBLISHED\") @db.VarChar(30)\n  startsAt  DateTime @map(\"starts_at\") @db.Timestamptz\n  endsAt    DateTime @map(\"ends_at\") @db.Timestamptz\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz\n\n  course   Course                @relation(fields: [courseId], references: [id], onDelete: Cascade)\n  bookings StudySessionBooking[]\n\n  @@index([status])\n  @@index([startsAt])\n  @@map(\"study_sessions\")\n}\n\nmodel StudySessionBooking {\n  id             String   @id @default(uuid()) @db.Uuid\n  studySessionId String   @map(\"study_session_id\") @db.Uuid\n  userId         String   @map(\"user_id\") @db.Uuid\n  status         String   @default(\"CONFIRMED\") @db.VarChar(30)\n  createdAt      DateTime @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt      DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz\n\n  studySession StudySession @relation(fields: [studySessionId], references: [id], onDelete: Cascade)\n  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@index([studySessionId])\n  @@map(\"study_session_bookings\")\n}\n",
  "inlineSchemaHash": "f5b4128391e55137b052891f140957b507dadc9169b6d16d4114c9fff9e8eacd",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"username\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"passwordHash\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"password_hash\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"profile\",\"kind\":\"object\",\"type\":\"UserProfile\",\"relationName\":\"UserToUserProfile\"},{\"name\":\"authAccounts\",\"kind\":\"object\",\"type\":\"AuthAccount\",\"relationName\":\"AuthAccountToUser\"},{\"name\":\"sessions\",\"kind\":\"object\",\"type\":\"UserSession\",\"relationName\":\"UserToUserSession\"},{\"name\":\"userRoles\",\"kind\":\"object\",\"type\":\"UserRole\",\"relationName\":\"UserToUserRole\"},{\"name\":\"tasks\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"TaskToUser\"},{\"name\":\"studyTimeLogs\",\"kind\":\"object\",\"type\":\"StudyTimeLog\",\"relationName\":\"StudyTimeLogToUser\"},{\"name\":\"auditLogs\",\"kind\":\"object\",\"type\":\"AuditLog\",\"relationName\":\"AuditLogToUser\"},{\"name\":\"studySessionBookings\",\"kind\":\"object\",\"type\":\"StudySessionBooking\",\"relationName\":\"StudySessionBookingToUser\"}],\"dbName\":\"users\"},\"UserProfile\":{\"fields\":[{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"firstName\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"first_name\"},{\"name\":\"lastName\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"last_name\"},{\"name\":\"identification\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"facebookUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"facebook_url\"},{\"name\":\"instagramUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"instagram_url\"},{\"name\":\"linkedinUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"linkedin_url\"},{\"name\":\"xUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"x_url\"},{\"name\":\"githubUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"github_url\"},{\"name\":\"tiktokUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"tiktok_url\"},{\"name\":\"websiteUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"website_url\"},{\"name\":\"avatarData\",\"kind\":\"scalar\",\"type\":\"Bytes\",\"dbName\":\"avatar_data\"},{\"name\":\"avatarMimeType\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"avatar_mime_type\"},{\"name\":\"avatarUpdatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"avatar_updated_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToUserProfile\"}],\"dbName\":\"user_profiles\"},\"AuthAccount\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"provider\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"providerAccountId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"provider_account_id\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AuthAccountToUser\"}],\"dbName\":\"auth_accounts\"},\"UserSession\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"sealedTokens\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"sealed_tokens\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"expires_at\"},{\"name\":\"revokedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"revoked_at\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToUserSession\"}],\"dbName\":\"user_sessions\"},\"Task\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"priority\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"due_date\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"TaskToUser\"},{\"name\":\"alerts\",\"kind\":\"object\",\"type\":\"Alert\",\"relationName\":\"AlertToTask\"}],\"dbName\":\"tasks\"},\"Alert\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"taskId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"task_id\"},{\"name\":\"scheduledTime\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"scheduled_time\"},{\"name\":\"sent\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"task\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"AlertToTask\"}],\"dbName\":\"alerts\"},\"StudyTimeLog\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"startTime\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"start_time\"},{\"name\":\"durationMinutes\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"duration_minutes\"},{\"name\":\"sessionType\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"session_type\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"StudyTimeLogToUser\"}],\"dbName\":\"study_time_logs\"},\"Role\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"organization_id\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"normalizedName\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"normalized_name\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isSystem\",\"kind\":\"scalar\",\"type\":\"Boolean\",\"dbName\":\"is_system\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"deleted_at\"},{\"name\":\"permissions\",\"kind\":\"object\",\"type\":\"RolePermission\",\"relationName\":\"RoleToRolePermission\"},{\"name\":\"userRoles\",\"kind\":\"object\",\"type\":\"UserRole\",\"relationName\":\"RoleToUserRole\"}],\"dbName\":\"roles\"},\"Permission\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"module\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"action\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"roles\",\"kind\":\"object\",\"type\":\"RolePermission\",\"relationName\":\"PermissionToRolePermission\"},{\"name\":\"menus\",\"kind\":\"object\",\"type\":\"MenuPermission\",\"relationName\":\"MenuPermissionToPermission\"}],\"dbName\":\"permissions\"},\"RolePermission\":{\"fields\":[{\"name\":\"roleId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"role_id\"},{\"name\":\"permissionId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"permission_id\"},{\"name\":\"granted\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"role\",\"kind\":\"object\",\"type\":\"Role\",\"relationName\":\"RoleToRolePermission\"},{\"name\":\"permission\",\"kind\":\"object\",\"type\":\"Permission\",\"relationName\":\"PermissionToRolePermission\"}],\"dbName\":\"role_permissions\"},\"UserRole\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"roleId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"role_id\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToUserRole\"},{\"name\":\"role\",\"kind\":\"object\",\"type\":\"Role\",\"relationName\":\"RoleToUserRole\"}],\"dbName\":\"user_roles\"},\"Menu\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"parentId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"parent_id\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"route\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"parent\",\"kind\":\"object\",\"type\":\"Menu\",\"relationName\":\"MenuHierarchy\"},{\"name\":\"children\",\"kind\":\"object\",\"type\":\"Menu\",\"relationName\":\"MenuHierarchy\"},{\"name\":\"permissions\",\"kind\":\"object\",\"type\":\"MenuPermission\",\"relationName\":\"MenuToMenuPermission\"}],\"dbName\":\"menus\"},\"MenuPermission\":{\"fields\":[{\"name\":\"menuId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"menu_id\"},{\"name\":\"permissionId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"permission_id\"},{\"name\":\"menu\",\"kind\":\"object\",\"type\":\"Menu\",\"relationName\":\"MenuToMenuPermission\"},{\"name\":\"permission\",\"kind\":\"object\",\"type\":\"Permission\",\"relationName\":\"MenuPermissionToPermission\"}],\"dbName\":\"menu_permissions\"},\"AuditLog\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"actorUserId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"actor_user_id\"},{\"name\":\"entityType\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"entity_type\"},{\"name\":\"entityId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"entity_id\"},{\"name\":\"action\",\"kind\":\"enum\",\"type\":\"AuditAction\"},{\"name\":\"changes\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"actor\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AuditLogToUser\"}],\"dbName\":\"audit_logs\"},\"Institution\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"deleted_at\"},{\"name\":\"campuses\",\"kind\":\"object\",\"type\":\"Campus\",\"relationName\":\"CampusToInstitution\"},{\"name\":\"courses\",\"kind\":\"object\",\"type\":\"Course\",\"relationName\":\"CourseToInstitution\"}],\"dbName\":\"institutions\"},\"Campus\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"institutionId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"institution_id\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"address\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"deleted_at\"},{\"name\":\"institution\",\"kind\":\"object\",\"type\":\"Institution\",\"relationName\":\"CampusToInstitution\"}],\"dbName\":\"campuses\"},\"Course\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"institutionId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"institution_id\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"credits\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"semester\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"deleted_at\"},{\"name\":\"institution\",\"kind\":\"object\",\"type\":\"Institution\",\"relationName\":\"CourseToInstitution\"},{\"name\":\"sections\",\"kind\":\"object\",\"type\":\"Section\",\"relationName\":\"CourseToSection\"},{\"name\":\"studySessions\",\"kind\":\"object\",\"type\":\"StudySession\",\"relationName\":\"CourseToStudySession\"}],\"dbName\":\"courses\"},\"Section\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"courseId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"course_id\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"classroom\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"schedule\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"capacity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"expectedUpdatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"expected_updated_at\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"course\",\"kind\":\"object\",\"type\":\"Course\",\"relationName\":\"CourseToSection\"},{\"name\":\"materials\",\"kind\":\"object\",\"type\":\"Material\",\"relationName\":\"MaterialToSection\"}],\"dbName\":\"sections\"},\"Material\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sectionId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"section_id\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"url\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"section\",\"kind\":\"object\",\"type\":\"Section\",\"relationName\":\"MaterialToSection\"}],\"dbName\":\"materials\"},\"StudySession\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"courseId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"course_id\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"startsAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"starts_at\"},{\"name\":\"endsAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"ends_at\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"course\",\"kind\":\"object\",\"type\":\"Course\",\"relationName\":\"CourseToStudySession\"},{\"name\":\"bookings\",\"kind\":\"object\",\"type\":\"StudySessionBooking\",\"relationName\":\"StudySessionToStudySessionBooking\"}],\"dbName\":\"study_sessions\"},\"StudySessionBooking\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"studySessionId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"study_session_id\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"studySession\",\"kind\":\"object\",\"type\":\"StudySession\",\"relationName\":\"StudySessionToStudySessionBooking\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"StudySessionBookingToUser\"}],\"dbName\":\"study_session_bookings\"}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = {
  getRuntime: () => require('./query_engine_bg.js'),
  getQueryEngineWasmModule: async () => {
    const loader = (await import('#wasm-engine-loader')).default
    const engine = (await loader).default
    return engine 
  }
}

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

