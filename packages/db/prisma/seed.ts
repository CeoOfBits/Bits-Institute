import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

const prisma = new PrismaClient();

const ROLES = [
  { key: 'SUPER_ADMIN', name: 'Super Admin', description: 'Full system access' },
  { key: 'ADMIN', name: 'Admin', description: 'Institute administration' },
  { key: 'INSTRUCTOR', name: 'Instructor', description: 'Teaches batches' },
  { key: 'STUDENT', name: 'Student', description: 'Learner' },
  { key: 'EDITOR', name: 'Editor', description: 'Blog and page content' },
];

const RESOURCES: Record<string, string[]> = {
  user: ['read', 'create', 'update', 'delete'],
  role: ['read', 'update'],
  student: ['read', 'create', 'update', 'delete', 'transfer'],
  instructor: ['read', 'create', 'update', 'delete'],
  course: ['read', 'create', 'update', 'delete'],
  category: ['read', 'create', 'update', 'delete'],
  batch: ['read', 'create', 'update', 'delete', 'archive'],
  enrollment: ['read', 'create', 'update'],
  attendance: ['read', 'mark'],
  assignment: ['read', 'create', 'update', 'grade'],
  quiz: ['read', 'create', 'update'],
  exam: ['read', 'create', 'update'],
  certificate: ['read', 'issue', 'revoke'],
  blog: ['read', 'create', 'update', 'delete', 'publish'],
  page: ['read', 'update'],
  media: ['read', 'create', 'delete'],
  payment: ['read', 'create', 'refund'],
  coupon: ['read', 'create', 'update'],
  report: ['read'],
  audit: ['read'],
  settings: ['read', 'update'],
};

const INSTRUCTOR_PERMS = [
  'course:read', 'batch:read', 'student:read', 'enrollment:read',
  'attendance:read', 'attendance:mark',
  'assignment:read', 'assignment:create', 'assignment:update', 'assignment:grade',
  'quiz:read', 'quiz:create', 'quiz:update', 'exam:read', 'exam:create', 'exam:update',
  'report:read',
];
const EDITOR_PERMS = [
  'blog:read', 'blog:create', 'blog:update', 'blog:publish',
  'page:read', 'page:update', 'media:read', 'media:create',
];

const CATEGORIES = [
  ['Networking', 'networking'],
  ['Cyber Security', 'cyber-security'],
  ['Artificial Intelligence', 'artificial-intelligence'],
  ['Web Development', 'web-development'],
  ['App Development', 'app-development'],
  ['Office & IT Skills', 'office-it-skills'],
];

const BLOG_CATEGORIES = [
  'Artificial Intelligence', 'Cyber Security', 'Networking', 'Web Development',
  'App Development', 'Technology', 'Career', 'Education',
];

const BADGES = [
  ['quiz-master', 'Quiz Master', 'Scored 90%+ on five quizzes'],
  ['fast-learner', 'Fast Learner', 'Finished a module ahead of schedule'],
  ['cyber-explorer', 'Cyber Explorer', 'Completed a Cyber Security course module'],
  ['course-champion', 'Course Champion', 'Completed a full course'],
  ['streak-7', '7-Day Streak', 'Learned seven days in a row'],
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function main() {
  // Roles & permissions
  for (const r of ROLES) {
    await prisma.role.upsert({ where: { key: r.key }, update: r, create: r });
  }
  const permKeys: string[] = [];
  for (const [res, actions] of Object.entries(RESOURCES)) {
    for (const a of actions) {
      const key = `${res}:${a}`;
      permKeys.push(key);
      await prisma.permission.upsert({
        where: { key },
        update: {},
        create: { key, name: `${a} ${res}` },
      });
    }
  }
  const roles = Object.fromEntries((await prisma.role.findMany()).map((r) => [r.key, r.id]));
  const perms = Object.fromEntries((await prisma.permission.findMany()).map((p) => [p.key, p.id]));

  const grant = async (roleKey: string, keys: string[]) => {
    for (const k of keys) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: roles[roleKey], permissionId: perms[k] } },
        update: {},
        create: { roleId: roles[roleKey], permissionId: perms[k] },
      });
    }
  };
  await grant('SUPER_ADMIN', permKeys);
  await grant('ADMIN', permKeys.filter((k) => !k.startsWith('role:')));
  await grant('INSTRUCTOR', INSTRUCTOR_PERMS);
  await grant('EDITOR', EDITOR_PERMS);

  // Taxonomy
  for (const [name, slug] of CATEGORIES) {
    await prisma.category.upsert({ where: { slug }, update: {}, create: { name, slug } });
  }
  for (const name of BLOG_CATEGORIES) {
    const slug = slugify(name);
    await prisma.blogCategory.upsert({ where: { slug }, update: {}, create: { name, slug } });
  }
  for (const [key, name, description] of BADGES) {
    await prisma.badge.upsert({ where: { key }, update: {}, create: { key, name, description } });
  }
  for (const placement of ['HEADER', 'BLOG', 'SIDEBAR', 'FOOTER']) {
    await prisma.adSlot.upsert({ where: { placement }, update: {}, create: { placement } });
  }

  // Super admin
  const email = (process.env.SEED_ADMIN_EMAIL ?? 'admin@bits.local').toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const password = process.env.SEED_ADMIN_PASSWORD ?? randomBytes(9).toString('base64url');
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(password, 12),
        firstName: 'BITS',
        lastName: 'Admin',
        status: 'ACTIVE',
        emailVerifiedAt: new Date(),
        roles: { create: { roleId: roles['SUPER_ADMIN'] } },
      },
    });
    console.log(`\nSuper admin created: ${user.email}\nPassword (shown once): ${password}\n`);
  } else {
    console.log(`Super admin already exists: ${email}`);
  }

  console.log(`Seeded ${ROLES.length} roles, ${permKeys.length} permissions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
