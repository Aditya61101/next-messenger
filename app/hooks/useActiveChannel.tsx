import { useEffect, useState } from "react";
import useActiveList from "./useActiveList";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "../libs/pusher";

const useActiveChannel = () => {
    const { set, add, remove } = useActiveList();
    const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
    //useEffect to listen leaving or joining present channel so to move people to global active list
    useEffect(() => {
        let channel = activeChannel;
        if (!channel) {
            channel = pusherClient.subscribe("presence-messenger");
            setActiveChannel(channel);
        }
        channel.bind("pusher:subscription_succeeded", (members: Members) => {
            const initialMembers: string[] = [];
            //each to be used instead of forEach or map
            members.each((member: Record<string, any>) => initialMembers.push(member.id));
            //set to active list
            set(initialMembers);
        });
        channel.bind("pusher:member_added", (member: Record<string, any>) => add(member.id))

        channel.bind("pusher:member_removed", (member: Record<string, any>) => remove(member.id))

        return () => {
            if (activeChannel) {
                pusherClient.unsubscribe("presence-messenger");
                setActiveChannel(null);
            }
        }
    }, [activeChannel, set, add, remove]);
};
export default useActiveChannel;