import { generateToken, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        if(!email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        //Find existing user with the same email
        const userFromDb = await prisma.user.findUnique({ where: { email } });
        if(!userFromDb) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        // Verify password
        const { passwordHash, ...userData} = userFromDb;
        const isPasswordValid = await verifyPassword(password, passwordHash);
        if(!isPasswordValid) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }


        // Generate token and set cookie (optional, can be done in a separate login step)
        const token = generateToken(userFromDb.id);

        // Set token in HTTP-only cookie
        const response = NextResponse.json({ message: "Login successful", user: userData }, { status: 200 });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60, // 1 hour
        });

        return response;

    } catch (error) {
        console.error("Error in login:", error);
        return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }
}