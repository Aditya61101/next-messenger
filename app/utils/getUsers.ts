import { getSession } from './getSession';
import prisma from "@/app/libs/prismaDB";

//this function is used to get all users except the current user, to show them in the users page
export const getUsers = async () => {
    const session = await getSession();
    if (!session?.user?.email)
        return [];
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc"
            },
            where: {
                email: {
                    not: session.user.email
                }
            }
        });
        return users;
    } catch (error) {
        return [];
    }
}