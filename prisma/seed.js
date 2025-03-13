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
      title: "Paris",
    },
  });

  const lyon = await prisma.location.create({
    data: {
      title: "Lyon",
    },
  });

  const bordeaux = await prisma.location.create({
    data: {
      title: "Bordeaux",
    },
  });

  console.log("Locations créées");

  // Créer les départements
  const direction = await prisma.department.create({
    data: {
      name: "Direction",
      description: "Comité de direction et stratégie",
    },
  });

  const rh = await prisma.department.create({
    data: {
      name: "Ressources Humaines",
      description: "Gestion des talents et recrutement",
    },
  });

  const tech = await prisma.department.create({
    data: {
      name: "Technologie",
      description: "Développement et infrastructure",
    },
  });

  const marketing = await prisma.department.create({
    data: {
      name: "Marketing",
      description: "Stratégie marketing et communication",
    },
  });

  console.log("Départements créés");

  // Création des membres (sans spécifier leur manager pour l'instant)
  const ceo = await prisma.member.create({
    data: {
      firstName: "Antoine",
      lastName: "Dupont",
      email: "antoine.dupont@example.com",
      position: "PDG",
      bio: "Fondateur et PDG avec 15 ans d'expérience dans le secteur",
      phoneNumber: "+33 1 23 45 67 89",
      startDate: new Date("2018-01-15"),
      imageUrl: "https://i.pravatar.cc/150?u=antoine",
      departmentId: direction.id,
      locationId: paris.id,
    },
  });

  const cto = await prisma.member.create({
    data: {
      firstName: "Marie",
      lastName: "Lavigne",
      email: "marie.lavigne@example.com",
      position: "CTO",
      bio: "Experte en architecture logicielle et en gestion d'équipes techniques",
      phoneNumber: "+33 1 23 45 67 90",
      startDate: new Date("2019-03-10"),
      imageUrl: "https://i.pravatar.cc/150?u=marie",
      departmentId: tech.id,
      locationId: paris.id,
    },
  });

  const rrhDirector = await prisma.member.create({
    data: {
      firstName: "Paul",
      lastName: "Martin",
      email: "paul.martin@example.com",
      position: "Directeur RH",
      bio: "Spécialiste en développement organisationnel et gestion des talents",
      phoneNumber: "+33 1 23 45 67 91",
      startDate: new Date("2019-05-22"),
      imageUrl: "https://i.pravatar.cc/150?u=paul",
      departmentId: rh.id,
      locationId: paris.id,
    },
  });

  const marketingDirector = await prisma.member.create({
    data: {
      firstName: "Sophie",
      lastName: "Dubois",
      email: "sophie.dubois@example.com",
      position: "Directrice Marketing",
      bio: "Expert en stratégies digitales et en développement de marque",
      phoneNumber: "+33 1 23 45 67 92",
      startDate: new Date("2020-01-15"),
      imageUrl: "https://i.pravatar.cc/150?u=sophie",
      departmentId: marketing.id,
      locationId: paris.id,
    },
  });

  // Développeurs
  const leadDev = await prisma.member.create({
    data: {
      firstName: "Lucas",
      lastName: "Petit",
      email: "lucas.petit@example.com",
      position: "Lead Developer",
      bio: "Spécialiste en architecture front-end et technologies React",
      phoneNumber: "+33 1 23 45 67 93",
      startDate: new Date("2020-04-10"),
      imageUrl: "https://i.pravatar.cc/150?u=lucas",
      departmentId: tech.id,
      locationId: lyon.id,
    },
  });

  const backendDev = await prisma.member.create({
    data: {
      firstName: "Emma",
      lastName: "Girard",
      email: "emma.girard@example.com",
      position: "Backend Developer",
      bio: "Experte en développement d'APIs et systèmes distribués",
      phoneNumber: "+33 1 23 45 67 94",
      startDate: new Date("2021-02-15"),
      imageUrl: "https://i.pravatar.cc/150?u=emma",
      departmentId: tech.id,
      locationId: lyon.id,
    },
  });

  const frontendDev = await prisma.member.create({
    data: {
      firstName: "Thomas",
      lastName: "Moreau",
      email: "thomas.moreau@example.com",
      position: "Frontend Developer",
      bio: "Développeur UI/UX avec spécialisation en accessibilité",
      phoneNumber: "+33 1 23 45 67 95",
      startDate: new Date("2021-07-01"),
      imageUrl: "https://i.pravatar.cc/150?u=thomas",
      departmentId: tech.id,
      locationId: bordeaux.id,
    },
  });

  // RH et Marketing
  const hrRecruiter = await prisma.member.create({
    data: {
      firstName: "Chloé",
      lastName: "Bernard",
      email: "chloe.bernard@example.com",
      position: "Chargée de recrutement",
      bio: "Spécialiste en recrutement tech et assessment",
      phoneNumber: "+33 1 23 45 67 96",
      startDate: new Date("2021-09-15"),
      imageUrl: "https://i.pravatar.cc/150?u=chloe",
      departmentId: rh.id,
      locationId: paris.id,
    },
  });

  const marketingManager = await prisma.member.create({
    data: {
      firstName: "Julien",
      lastName: "Roux",
      email: "julien.roux@example.com",
      position: "Marketing Manager",
      bio: "Expert en marketing digital et analyse de données",
      phoneNumber: "+33 1 23 45 67 97",
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
