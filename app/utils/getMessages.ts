import prisma from "@/app/libs/prismaDB";

const getMessages = async (conversationId: string) => {
    try {
        const messages = await prisma.message.findMany({
            where: { conversationId: conversationId },
            include: {seenBy:true, sender:true},
            orderBy: { createdAt: 'asc' }
        })
        return messages;
    } catch (error) {
        return null;
    }
}
export default getMessages;