import { getCurrentUser } from "@/app/utils/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismaDB";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        const body = await req.json();
        const { conversationId, message, image } = body;
        if (!currentUser?.id || !currentUser?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const newMessage = await prisma.message.create({
            data: {
                body: message,
                image,
                conversation: {
                    connect: {
                        id: conversationId
                    }
                },
                sender: {
                    connect: {
                        id: currentUser.id
                    }
                },
                seenBy: {
                    connect: {
                        id: currentUser.id
                    }
                }
            },
            include: {
                sender: true,
                seenBy: true
            }
        });

        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seenBy: true
                    }
                }
            }
        });
        //real time update of new message in the Body of the conversation
        await pusherServer.trigger(conversationId, 'message:new', newMessage);

        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];
        
        updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email!,"conversation:update",{
                id:conversationId,
                messages:[lastMessage]
            })
        })

        return NextResponse.json({ message: newMessage }, { status: 201 });
    } catch (err: any) {
        console.log(err, "ERROR Message from messages route");
        return NextResponse.json({ error: "Internal Server Error!" }, { status: 500 });
    }
}