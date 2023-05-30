import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismaDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password } = body;
        if (!email || !password || !name) {
            return NextResponse.json({ error: "Field(s) Missing", status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 11);
        const user = await prisma.user.create({
            data: { email, name, hashedPassword }
        });
        return NextResponse.json({ success: true, user, status: 201 });
    } catch (error: any) {
        console.error(error, "Internal Server Error");
        return NextResponse.json({ error: "Internal Server Error", status: 500 });
    }

}