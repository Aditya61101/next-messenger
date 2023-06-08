import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { pusherServer } from "@/app/libs/pusher";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if(!session?.user?.email)
        return null;
    const { user } = session!;
    if (!user?.email) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const { channel_name, socket_id } = req.body;
    const data = {
        user_id: user.email,
    }
    const auth = pusherServer.authorizeChannel(socket_id, channel_name, data);
    return res.status(200).json(auth);
}