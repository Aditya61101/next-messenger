import { Conversation, Message, User } from "@prisma/client";

type FullMessageType = Message & {
    sender: User,
    seenBy: User[]
};

type FullConversationType = Conversation & {
    users: User[],
    messages: FullMessageType[]
};