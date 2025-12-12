import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Use DIRECT_URL for seed scripts (no connection pooling needed)
const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const powerTools = await prisma.category.upsert({
    where: { slug: "power-tools" },
    update: {},
    create: {
      name: "Power Tools",
      slug: "power-tools",
      description: "Electric and battery-powered tools for construction and DIY projects",
    },
  });

  const lawnEquipment = await prisma.category.upsert({
    where: { slug: "lawn-equipment" },
    update: {},
    create: {
      name: "Lawn Equipment",
      slug: "lawn-equipment",
      description: "Tools and equipment for lawn care and landscaping",
    },
  });

  console.log("✅ Created categories:", {
    powerTools: powerTools.name,
    lawnEquipment: lawnEquipment.name,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
