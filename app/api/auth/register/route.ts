import { UserRole } from "@/generated/prisma";
import { generateToken, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, password, firstName, lastName } = await request.json();
        if(!email || !password || !firstName || !lastName) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        //Find existing user with the same email
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if(existingUser) {
            return NextResponse.json({ message: "Email already in use" }, { status: 409 });
        }

        //Create new user
        const passwordHash = await hashPassword(password);
        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
                role: UserRole.CUSTOMER
            },
        });

        // Generate token and set cookie (optional, can be done in a separate login step)
        const token = generateToken(newUser.id);

        // Set token in HTTP-only cookie
        const response = NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60, // 1 hour
        });

        return response;

    } catch (error) {
        console.error("Error in registration:", error);
        return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }
}