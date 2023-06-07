import Sidebar from "../components/Sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import getConversations from "../utils/getConversations";
import { User } from "@prisma/client";
import { getUsers } from "../utils/getUsers";
import { FullConversationType } from "@/typings";

export default async function ConversationsLayout({ children }: { children: React.ReactNode }) {
    const conversationsPromise: Promise<FullConversationType[]> = getConversations();
    const usersPromise: Promise<User[]> = getUsers();
    const [conversations,users] = await Promise.all([conversationsPromise, usersPromise]);
    
    return (
        //@ts-expect-error Server component
        <Sidebar>
            <div className="h-full">
                <ConversationList items={conversations} users={users} title="Messages" />
                {children}
            </div>
        </Sidebar>
    )
}
// const conversations: FullConversationType[] = await conversationsPromise;
    // const users: User[] = await usersPromise;