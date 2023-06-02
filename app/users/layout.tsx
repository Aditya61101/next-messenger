import { User } from "@prisma/client";
import Sidebar from "../components/Sidebar/Sidebar"
import { getUsers } from "../utils/getUsers"
import UsersList from "./components/UsersList";

export default async function UsersLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const usersPromise:Promise<User[]> = getUsers();
    const users:User[] = await usersPromise;

    return (
        //@ts-expect-error Server component
        <Sidebar>
        <main className="h-full">
            <UsersList users={users} />
            {children}
        </main>
        </Sidebar>
    )
}