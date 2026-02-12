import bcrypt from "bcryptjs";
import { PrismaClient, MembershipRole, ProjectMode, TaskStatus, TaskPriority } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const [admin, member] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@demo.local" },
      create: { email: "admin@demo.local", name: "Demo Admin", passwordHash },
      update: { name: "Demo Admin", passwordHash }
    }),
    prisma.user.upsert({
      where: { email: "member@demo.local" },
      create: { email: "member@demo.local", name: "Demo Member", passwordHash },
      update: { name: "Demo Member", passwordHash }
    })
  ]);

  const organisation = await prisma.organisation.upsert({
    where: { slug: "demo-org" },
    create: { name: "Demo Organisation", slug: "demo-org" },
    update: { name: "Demo Organisation" }
  });

  await prisma.membership.upsert({
    where: {
      organisationId_userId: {
        organisationId: organisation.id,
        userId: admin.id
      }
    },
    create: {
      organisationId: organisation.id,
      userId: admin.id,
      role: MembershipRole.ORG_ADMIN
    },
    update: { role: MembershipRole.ORG_ADMIN }
  });

  await prisma.membership.upsert({
    where: {
      organisationId_userId: {
        organisationId: organisation.id,
        userId: member.id
      }
    },
    create: {
      organisationId: organisation.id,
      userId: member.id,
      role: MembershipRole.PROJECT_MEMBER
    },
    update: { role: MembershipRole.PROJECT_MEMBER }
  });

  const project = await prisma.project.upsert({
    where: { organisationId_code: { organisationId: organisation.id, code: "WF-001" } },
    create: {
      organisationId: organisation.id,
      name: "Website Relaunch",
      code: "WF-001",
      mode: ProjectMode.WATERFALL,
      createdById: admin.id
    },
    update: { name: "Website Relaunch", mode: ProjectMode.WATERFALL }
  });

  const discoveryTask = await prisma.task.upsert({
    where: { id: `${project.id}-task-1` },
    create: {
      id: `${project.id}-task-1`,
      projectId: project.id,
      title: "Discovery and planning",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      startDate: new Date(),
      durationDays: 5,
      percentComplete: 40,
      estimatedHours: 32
    },
    update: {
      title: "Discovery and planning",
      percentComplete: 40
    }
  });

  await prisma.task.upsert({
    where: { id: `${project.id}-task-2` },
    create: {
      id: `${project.id}-task-2`,
      projectId: project.id,
      title: "Design sign-off milestone",
      status: TaskStatus.NOT_STARTED,
      priority: TaskPriority.MEDIUM,
      milestone: true,
      startDate: new Date(),
      durationDays: 0
    },
    update: { title: "Design sign-off milestone" }
  });

  await prisma.taskDependency.upsert({
    where: {
      projectId_predecessorTaskId_successorTaskId_dependencyType: {
        projectId: project.id,
        predecessorTaskId: discoveryTask.id,
        successorTaskId: `${project.id}-task-2`,
        dependencyType: "FS"
      }
    },
    create: {
      projectId: project.id,
      predecessorTaskId: discoveryTask.id,
      successorTaskId: `${project.id}-task-2`,
      dependencyType: "FS",
      lagDays: 0
    },
    update: { lagDays: 0 }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
