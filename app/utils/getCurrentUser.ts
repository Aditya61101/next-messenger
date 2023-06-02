import prisma from "@/app/libs/prismaDB";
import { getSession } from "./getSession";

export const getCurrentUser = async () => {
    try {
        const session = await getSession();
        if (!session?.user?.email)
            return null;
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email!
            }
        })
        return user;
    } catch (error) {
        return null;
    }
}