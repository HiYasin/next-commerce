import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { count } from "node:console";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "You are not authenticated" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    if (user.role === "ADMIN" || user.role === "MANAGER") {
        const users = await prisma.user.findMany({
            skip: offset,
            take: limit,
            where: {
                id: {not: user.id}
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        return NextResponse.json({ message: "Users retrieved successfully", users, count: users.length }, { status: 200 });
    }
    else{
        return NextResponse.json({ error: "You are not authorized to view users" }, { status: 403 });
    }


  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}