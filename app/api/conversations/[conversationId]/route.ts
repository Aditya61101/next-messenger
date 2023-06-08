import { getCurrentUser } from "@/app/utils/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismaDB";
import { pusherServer } from "@/app/libs/pusher";
type Props = {
    params: {
        conversationId: string
    }
}
export default async function DELETE(_: NextRequest, { params: { conversationId } }: Props) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const existingConvo = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        })
        if (!existingConvo)
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        const deletedConvo = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        })

        //realtime delete conversation
        existingConvo.users.forEach((user) => {
            if (user.email)
                pusherServer.trigger(user.email, "conversation:delete", existingConvo);
        })
        return NextResponse.json({ deletedConvo }, { status: 200 });
    } catch (error) {
        console.log(error, "ERROR_CONVERSATION_DELETE");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}