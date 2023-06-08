import { getCurrentUser } from "@/app/utils/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismaDB";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, image } = body;
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                name,
                image
            }
        });
        return NextResponse.json({ updatedUser }, { status: 200 });
    } catch (error) {
        console.log(error, "ERROR_SETTINGS_ROUTE");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}