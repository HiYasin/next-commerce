import "dotenv/config";
import { hashPassword } from "@/lib/auth";
// import { prisma } from "@/lib/db";
import { UserRole } from "@/types";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/generated/prisma";
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log("Seeding database...");

    // Seeding an admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "12345678";

    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    // const existingAdmin = false;

    if (!existingAdmin) {
        const adminUser = await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash: await hashPassword(adminPassword),
                firstName: "Admin",
                lastName: "User",
                role: UserRole.ADMIN
            }
        });
        console.log("Admin user created:", adminUser);
    }
    else {
        console.log("Admin user already exists.");
        console.log(existingAdmin);
    }

    // You can add more seeding logic here for products, categories, etc.
}

main().catch((e) => {
    console.error("Error occurred while seeding the database:", e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});