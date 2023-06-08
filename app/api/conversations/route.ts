import { getCurrentUser } from "@/app/utils/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismaDB";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(req: NextRequest) {
    try {
        const { userId, isGroup, members, name } = await req.json();
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (isGroup && (!members || members.length < 2 || !name)) {
            return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
        }
        //for group conversation
        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        connect: [
                            ...members.map((member: { value: string }) => ({ id: member.value })),
                            { id: currentUser.id }
                        ]
                    }
                },
                include: {
                    users: true
                }
            })
            //to notify each user of a newly created conversation in real time
            newConversation.users.forEach((user) => {
                if (user.email) {
                    pusherServer.trigger(user.email, "conversation:new", newConversation)
                }
            });
            return NextResponse.json({ conversation: newConversation }, { status: 201 });
        }
        //for 1->1 conversation
        const existingConversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [userId, currentUser.id]
                        }
                    },
                    {
                        userIds: {
                            equals: [currentUser.id, userId]
                        }
                    }
                ]
            }
        });
        if (existingConversations.length > 0) {
            return NextResponse.json({ conversation: existingConversations[0] }, { status: 200 });
        }
        const newConversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        { id: userId },
                        { id: currentUser.id }
                    ]
                }
            },
            include: {
                users: true
            }
        });
        //to notify each user of a newly created conversation in real time
        newConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, "conversation:new", newConversation)
            }
        });
        return NextResponse.json({ conversation: newConversation }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}