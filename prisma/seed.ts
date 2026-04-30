import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UserRole } from "@/types";


async function main() {
    console.log("Seeding database...");

    // Seeding an admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "12345678";

    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    // const existingAdmin = false;

    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash: await hashPassword(adminPassword),
                firstName: "Admin",
                lastName: "User",
                role: UserRole.ADMIN
            }
        });
        console.log("✅ Admin user created successfully.");
    }
    else {
        console.log("‼️ Admin user already exists.");
    }

    // You can add more seeding logic here for products, categories, etc.
}

main().catch((e) => {
    console.error("Error occurred while seeding the database:", e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});