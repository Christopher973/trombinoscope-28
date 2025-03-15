import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Nettoyer les données existantes
  await prisma.teamMember.deleteMany();
  await prisma.department.deleteMany();
  await prisma.location.deleteMany();

  // Départements
  const departments = [
    { id: 1, name: "Executive" },
    { id: 2, name: "Technology" },
    { id: 3, name: "Finance" },
    { id: 4, name: "Product" },
    { id: 5, name: "Human Resources" },
    { id: 6, name: "Engineering" },
    { id: 7, name: "Design" },
    { id: 8, name: "Marketing" },
    { id: 9, name: "Sales" },
    { id: 10, name: "Support" },
  ];

  for (const dept of departments) {
    await prisma.department.create({
      data: dept,
    });
  }

  // Emplacements
  const locations = [
    { id: 1, name: "New York" },
    { id: 2, name: "San Francisco" },
    { id: 3, name: "Chicago" },
    { id: 4, name: "Boston" },
    { id: 5, name: "Miami" },
    { id: 6, name: "Seattle" },
    { id: 7, name: "Los Angeles" },
    { id: 8, name: "Austin" },
  ];

  for (const loc of locations) {
    await prisma.location.create({
      data: loc,
    });
  }

  // Fonction utilitaire pour obtenir une URL d'image de placeholder
  const getPlaceholderImage = (id) => {
    return `https://i.pravatar.cc/300?img=${id % 70}`;
  };

  // Données initiales des membres d'équipe
  const teamMembers = [
    {
      id: 1,
      firstname: "Emily",
      lastname: "Johnson",
      professionnalEmail: "emily.johnson@company.com",
      jobDescription: "CEO",
      managementCategory: "Executive",
      serviceAssignmentCode: "EX-001",
      gender: "Female",
      departmentId: 1,
      managerId: null,
      locationId: 1,
      imageUrl: getPlaceholderImage(1),
      startDate: new Date("2016-03-15"),
      birthday: new Date("1980-05-12"),
    },
    {
      id: 2,
      firstname: "Michael",
      lastname: "Chen",
      professionnalEmail: "michael.chen@company.com",
      jobDescription: "CTO",
      managementCategory: "Executive",
      serviceAssignmentCode: "EX-002",
      gender: "Male",
      departmentId: 2,
      managerId: 1,
      locationId: 2,
      imageUrl: getPlaceholderImage(2),
      startDate: new Date("2017-06-02"),
      birthday: new Date("1982-09-23"),
    },
    {
      id: 3,
      firstname: "Sarah",
      lastname: "Patel",
      professionnalEmail: "sarah.patel@company.com",
      jobDescription: "CFO",
      managementCategory: "Executive",
      serviceAssignmentCode: "EX-003",
      gender: "Female",
      departmentId: 3,
      managerId: 1,
      locationId: 3,
      imageUrl: getPlaceholderImage(3),
      startDate: new Date("2018-02-12"),
      birthday: new Date("1979-11-05"),
    },
    {
      id: 4,
      firstname: "David",
      lastname: "Thompson",
      professionnalEmail: "david.thompson@company.com",
      jobDescription: "VP of Product",
      managementCategory: "Management",
      serviceAssignmentCode: "PM-001",
      gender: "Male",
      departmentId: 4,
      managerId: 1,
      locationId: 4,
      imageUrl: getPlaceholderImage(4),
      startDate: new Date("2019-04-25"),
      birthday: new Date("1985-07-18"),
    },
    {
      id: 5,
      firstname: "Jennifer",
      lastname: "Martinez",
      professionnalEmail: "jennifer.martinez@company.com",
      jobDescription: "VP of HR",
      managementCategory: "Management",
      serviceAssignmentCode: "HR-001",
      gender: "Female",
      departmentId: 5,
      managerId: 1,
      locationId: 5,
      imageUrl: getPlaceholderImage(5),
      startDate: new Date("2019-08-03"),
      birthday: new Date("1983-02-14"),
    },
    {
      id: 6,
      firstname: "Alex",
      lastname: "Wong",
      professionnalEmail: "alex.wong@company.com",
      jobDescription: "Engineering Manager",
      managementCategory: "Management",
      serviceAssignmentCode: "EG-001",
      gender: "Male",
      departmentId: 6,
      managerId: 2,
      locationId: 6,
      imageUrl: getPlaceholderImage(6),
      startDate: new Date("2018-11-15"),
      birthday: new Date("1987-06-22"),
    },
    {
      id: 7,
      firstname: "Rachel",
      lastname: "Kim",
      professionnalEmail: "rachel.kim@company.com",
      jobDescription: "Senior Developer",
      managementCategory: "Individual Contributor",
      serviceAssignmentCode: "SD-001",
      gender: "Female",
      departmentId: 6,
      managerId: 6,
      locationId: 7,
      imageUrl: getPlaceholderImage(7),
      startDate: new Date("2020-01-20"),
      birthday: new Date("1990-10-30"),
    },
    {
      id: 8,
      firstname: "Carlos",
      lastname: "Garcia",
      professionnalEmail: "carlos.garcia@company.com",
      jobDescription: "UX Designer",
      managementCategory: "Individual Contributor",
      serviceAssignmentCode: "DS-001",
      gender: "Male",
      departmentId: 7,
      managerId: 4,
      locationId: 8,
      imageUrl: getPlaceholderImage(8),
      startDate: new Date("2021-03-08"),
      birthday: new Date("1992-04-17"),
    },
  ];

  // Créer les membres de l'équipe
  for (const member of teamMembers) {
    await prisma.teamMember.create({
      data: member,
    });
  }

  // Générer des membres d'équipe supplémentaires pour la démo
  await generateTeamMembers(50);

  console.log("La base de données a été remplie avec succès");
}

// Fonction pour générer des membres d'équipe aléatoires
async function generateTeamMembers(count) {
  const firstNames = [
    "James",
    "Robert",
    "John",
    "William",
    "Richard",
    "Thomas",
    "Mary",
    "Patricia",
    "Linda",
    "Barbara",
    "Elizabeth",
    "Susan",
    "Jessica",
    "Sarah",
    "Karen",
    "Nancy",
    "Lisa",
    "Margaret",
    "Betty",
    "Sandra",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
    "Davis",
    "Garcia",
    "Rodriguez",
    "Wilson",
    "Martinez",
    "Anderson",
    "Taylor",
    "Thomas",
    "Hernandez",
    "Moore",
    "Martin",
    "Jackson",
    "Thompson",
    "White",
  ];
  const jobDescriptions = [
    "Software Engineer",
    "Product Manager",
    "UI Designer",
    "QA Engineer",
    "Data Scientist",
    "System Administrator",
    "Marketing Specialist",
    "Sales Representative",
    "Customer Support",
    "Financial Analyst",
  ];
  const managementCategories = [
    "Individual Contributor",
    "Management",
    "Executive",
  ];

  // Récupérer tous les membres existants pour pouvoir les assigner comme managers
  const existingMembers = await prisma.teamMember.findMany({
    select: { id: true },
  });
  const potentialManagerIds = existingMembers.map((m) => m.id);

  const departmentCount = await prisma.department.count();
  const locationCount = await prisma.location.count();

  // On commence après les 8 membres initiaux
  const startId = 9;

  // Générer et créer de nouveaux membres
  for (let i = 0; i < count; i++) {
    const id = startId + i;
    const firstname = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastname = lastNames[Math.floor(Math.random() * lastNames.length)];
    const jobDescription =
      jobDescriptions[Math.floor(Math.random() * jobDescriptions.length)];
    const departmentId = Math.floor(Math.random() * departmentCount) + 1;
    const locationId = Math.floor(Math.random() * locationCount) + 1;
    const managementCategory =
      managementCategories[
        Math.floor(Math.random() * managementCategories.length)
      ];
    const serviceAssignmentCode = `${departmentId}-${id
      .toString()
      .padStart(3, "0")}`;

    // Assigner un manager aléatoire
    const managerId =
      potentialManagerIds[
        Math.floor(Math.random() * potentialManagerIds.length)
      ];

    // Générer des dates aléatoires
    const birthYear = 1970 + Math.floor(Math.random() * 30);
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1;
    const birthday = new Date(birthYear, birthMonth - 1, birthDay);

    const startYear = 2018 + Math.floor(Math.random() * 5);
    const startMonth = Math.floor(Math.random() * 12) + 1;
    const startDay = Math.floor(Math.random() * 28) + 1;
    const startDate = new Date(startYear, startMonth - 1, startDay);

    try {
      await prisma.teamMember.create({
        data: {
          id: id,
          firstname,
          lastname,
          // Garantir l'unicité des emails en ajoutant l'ID
          professionnalEmail: `${firstname.toLowerCase()}.${lastname.toLowerCase()}${id}@company.com`,
          jobDescription,
          managementCategory,
          serviceAssignmentCode,
          gender: Math.random() > 0.5 ? "Male" : "Female",
          departmentId,
          managerId,
          locationId,
          imageUrl: `https://i.pravatar.cc/300?img=${id % 70}`,
          startDate,
          birthday,
        },
      });
    } catch (error) {
      console.error(`Erreur lors de la création du membre ${id}:`, error);
      // Continuer avec les autres membres même si un échoue
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
