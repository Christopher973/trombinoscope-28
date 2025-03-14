
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Nettoyer la base de données existante
  await prisma.member.deleteMany();
  await prisma.department.deleteMany();
  await prisma.location.deleteMany();

  console.log("Base de données nettoyée");

  // Créer les locations
  const paris = await prisma.location.create({
    data: {
      name: "Paris",
    },
  });

  const lyon = await prisma.location.create({
    data: {
      name: "Lyon",
    },
  });

  const bordeaux = await prisma.location.create({
    data: {
      name: "Bordeaux",
    },
  });

  console.log("Locations créées");

  // Créer les départements
  const direction = await prisma.department.create({
    data: {
      name: "Direction",
    },
  });

  const rh = await prisma.department.create({
    data: {
      name: "Ressources Humaines",
    },
  });

  const tech = await prisma.department.create({
    data: {
      name: "Technologie",
    },
  });

  const marketing = await prisma.department.create({
    data: {
      name: "Marketing",
    },
  });

  console.log("Départements créés");

  // Dates communes
  const defaultBirthday = new Date("1985-01-01");
  
  // Création des membres (sans spécifier leur manager pour l'instant)
  const ceo = await prisma.member.create({
    data: {
      firstname: "Antoine",
      lastname: "Dupont",
      gender: "Homme",
      professionnalEmail: "antoine.dupont@example.com",
      jobDescription: "PDG",
      managementCategory: "Direction",
      serviceAssignmentCode: "DIR-001",
      birthday: defaultBirthday,
      startDate: new Date("2018-01-15"),
      imageUrl: "https://i.pravatar.cc/150?u=antoine",
      departmentId: direction.id,
      locationId: paris.id,
    },
  });

  const cto = await prisma.member.create({
    data: {
      firstname: "Marie",
      lastname: "Lavigne",
      gender: "Femme",
      professionnalEmail: "marie.lavigne@example.com",
      jobDescription: "CTO",
      managementCategory: "Direction Technique",
      serviceAssignmentCode: "TECH-001",
      birthday: defaultBirthday,
      startDate: new Date("2019-03-10"),
      imageUrl: "https://i.pravatar.cc/150?u=marie",
      departmentId: tech.id,
      locationId: paris.id,
    },
  });

  const rrhDirector = await prisma.member.create({
    data: {
      firstname: "Paul",
      lastname: "Martin",
      gender: "Homme",
      professionnalEmail: "paul.martin@example.com",
      jobDescription: "Directeur RH",
      managementCategory: "Management",
      serviceAssignmentCode: "RH-001",
      birthday: defaultBirthday,
      startDate: new Date("2019-05-22"),
      imageUrl: "https://i.pravatar.cc/150?u=paul",
      departmentId: rh.id,
      locationId: paris.id,
    },
  });

  const marketingDirector = await prisma.member.create({
    data: {
      firstname: "Sophie",
      lastname: "Dubois",
      gender: "Femme",
      professionnalEmail: "sophie.dubois@example.com",
      jobDescription: "Directrice Marketing",
      managementCategory: "Management",
      serviceAssignmentCode: "MKT-001",
      birthday: defaultBirthday,
      startDate: new Date("2020-01-15"),
      imageUrl: "https://i.pravatar.cc/150?u=sophie",
      departmentId: marketing.id,
      locationId: paris.id,
    },
  });

  // Développeurs
  const leadDev = await prisma.member.create({
    data: {
      firstname: "Lucas",
      lastname: "Petit",
      gender: "Homme",
      professionnalEmail: "lucas.petit@example.com",
      jobDescription: "Lead Developer",
      managementCategory: "Tech Lead",
      serviceAssignmentCode: "TECH-002",
      birthday: defaultBirthday,
      startDate: new Date("2020-04-10"),
      imageUrl: "https://i.pravatar.cc/150?u=lucas",
      departmentId: tech.id,
      locationId: lyon.id,
    },
  });

  const backendDev = await prisma.member.create({
    data: {
      firstname: "Emma",
      lastname: "Girard",
      gender: "Femme",
      professionnalEmail: "emma.girard@example.com",
      jobDescription: "Backend Developer",
      managementCategory: "Technique",
      serviceAssignmentCode: "TECH-003",
      birthday: defaultBirthday,
      startDate: new Date("2021-02-15"),
      imageUrl: "https://i.pravatar.cc/150?u=emma",
      departmentId: tech.id,
      locationId: lyon.id,
    },
  });

  const frontendDev = await prisma.member.create({
    data: {
      firstname: "Thomas",
      lastname: "Moreau",
      gender: "Homme",
      professionnalEmail: "thomas.moreau@example.com",
      jobDescription: "Frontend Developer",
      managementCategory: "Technique",
      serviceAssignmentCode: "TECH-004",
      birthday: defaultBirthday,
      startDate: new Date("2021-07-01"),
      imageUrl: "https://i.pravatar.cc/150?u=thomas",
      departmentId: tech.id,
      locationId: bordeaux.id,
    },
  });

  // RH et Marketing
  const hrRecruiter = await prisma.member.create({
    data: {
      firstname: "Chloé",
      lastname: "Bernard",
      gender: "Femme",
      professionnalEmail: "chloe.bernard@example.com",
      jobDescription: "Chargée de recrutement",
      managementCategory: "RH",
      serviceAssignmentCode: "RH-002",
      birthday: defaultBirthday,
      startDate: new Date("2021-09-15"),
      imageUrl: "https://i.pravatar.cc/150?u=chloe",
      departmentId: rh.id,
      locationId: paris.id,
    },
  });

  const marketingManager = await prisma.member.create({
    data: {
      firstname: "Julien",
      lastname: "Roux",
      gender: "Homme",
      professionnalEmail: "julien.roux@example.com",
      jobDescription: "Marketing Manager",
      managementCategory: "Marketing",
      serviceAssignmentCode: "MKT-002",
      birthday: defaultBirthday,
      startDate: new Date("2022-01-10"),
      imageUrl: "https://i.pravatar.cc/150?u=julien",
      departmentId: marketing.id,
      locationId: bordeaux.id,
    },
  });

  console.log("Membres créés");

  // Mise à jour des relations managériales
  await prisma.member.update({
    where: { id: cto.id },
    data: { managerId: ceo.id },
  });

  await prisma.member.update({
    where: { id: rrhDirector.id },
    data: { managerId: ceo.id },
  });

  await prisma.member.update({
    where: { id: marketingDirector.id },
    data: { managerId: ceo.id },
  });

  await prisma.member.update({
    where: { id: leadDev.id },
    data: { managerId: cto.id },
  });

  await prisma.member.update({
    where: { id: backendDev.id },
    data: { managerId: leadDev.id },
  });

  await prisma.member.update({
    where: { id: frontendDev.id },
    data: { managerId: leadDev.id },
  });

  await prisma.member.update({
    where: { id: hrRecruiter.id },
    data: { managerId: rrhDirector.id },
  });

  await prisma.member.update({
    where: { id: marketingManager.id },
    data: { managerId: marketingDirector.id },
  });

  console.log("Relations managériales mises à jour");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
