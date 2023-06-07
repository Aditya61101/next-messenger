import { getCurrentUser } from "@/app/utils/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismaDB";

type Props = {
    params: {
        conversationId: string;
    }
}

export async function POST(_: NextRequest, { params: { conversationId } }: Props) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                messages: {
                    include: {
                        seenBy: true
                    }
                },
                users: true
            }
        });
        if (!conversation)
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

        //find last message
        const conversationMessagesLength = conversation.messages.length;
        const lastMessage = conversation.messages[conversationMessagesLength - 1];
        if (!lastMessage)
            return NextResponse.json({ conversation: conversation }, { status: 200 });

        //update seenBy of last message
        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id
            },
            data: {
                seenBy: {
                    connect: {
                        id: currentUser.id
                    }
                }
            },
            include: {
                seenBy: true,
                sender: true
            }
        });
        return NextResponse.json({ updatedMessage }, { status: 200 });
    } catch (err: any) {
        console.log(err, 'ERROR_MESSAGES_SEEN');
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}