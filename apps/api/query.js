import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany();
  console.log('Projects:', JSON.stringify(projects, null, 2));
  
  const profiles = await prisma.profile.findMany();
  console.log('Profiles:', JSON.stringify(profiles, null, 2));

  const experiences = await prisma.experience.findMany();
  console.log('Experiences:', JSON.stringify(experiences, null, 2));

  const education = await prisma.educationCertification.findMany();
  console.log('Education:', JSON.stringify(education, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
