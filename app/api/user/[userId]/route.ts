import { checkUserPermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UserRole } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await context.params;
        const { role } = await request.json();

        // Validate the role
        if(!role || !Object.values(UserRole).includes(role) || role === UserRole.ADMIN){
            return NextResponse.json({ message: "Invalid role provided" }, { status: 400 });
        }

        // Check user permissions
        const user = await getCurrentUser();
        if(!user || !checkUserPermission(user, UserRole.ADMIN)){
            return NextResponse.json({ message: "You are not authorized" }, { status: 401 });
        }

        const updateUserRole = await prisma.user.update({
            where: { id: userId },
            data: {
                role: role
            },
            omit: { passwordHash: true }
        });

        return NextResponse.json({
            message: "User role updated successfully",
            user: updateUserRole
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating user role:", error);
        if (error instanceof Error && error.message) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}


export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await context.params;
        // Check user permissions
        const user = await getCurrentUser();
        if(!user || !checkUserPermission(user, UserRole.ADMIN)){
            return NextResponse.json({ message: "You are not authorized" }, { status: 401 });
        }

        const res = await prisma.user.delete({
            where: { id: userId }
        });

        console.log(res);
        
        return NextResponse.json({
            message: "User deleted successfully"
        }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        if (error instanceof Error && error.message) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};