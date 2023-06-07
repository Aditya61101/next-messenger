"use client";
import { FullConversationType } from '@/typings';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react'
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import useOtherUser from '@/app/hooks/useOtherUser';
import Avatar from '@/app/components/Avatar';
import AvatarGroup from '@/app/components/AvatarGroup';

type Props = {
    data: FullConversationType;
    selected?: boolean;
}
const ConversationBox = ({ data, selected }: Props) => {
    const router = useRouter();
    const session = useSession();
    const otherUser = useOtherUser(data);

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`);
    }, [data.id, router]);

    const lastMessage = useMemo(() => {
        const messages = data.messages || [];
        return messages[messages.length - 1];
    }, [data.messages]);

    const userEmail = useMemo(() => session.data?.user?.email, [session.data?.user?.email]);

    const hasSeen = useMemo(() => {
        if (!lastMessage)
            return false;
        const seenArray = lastMessage.seenBy || [];
        if (!userEmail)
            return false;
        // returns true if the currentUser has seen the message
        return seenArray.filter((user) => user.email === userEmail).length !== 0;
    }, [userEmail, lastMessage]);

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image)
            return 'Sent an image';
        if (lastMessage?.body)
            return lastMessage?.body
        return 'Started a conversation';
    }, [lastMessage]);

    return (
        <div
            onClick={handleClick}
            className={clsx(`
        w-full 
        relative 
        flex 
        items-center 
        space-x-3 
        p-3 
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
      `,
                selected ? 'bg-neutral-100' : 'bg-white'
            )} >
            {data.isGroup ? <AvatarGroup users={data.users} /> :
                <Avatar user={otherUser} />}
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-md font-medium text-gray-900">
                            {data.name || otherUser.name}
                        </p>
                        {lastMessage?.createdAt && (
                            <p
                                className="
                  text-xs 
                  text-gray-400 
                  font-light
                "
                            >
                                {format(new Date(lastMessage.createdAt), 'p')}
                            </p>
                        )}
                    </div>
                    <p
                        className={clsx(`
              truncate 
              text-sm
              `,
                            hasSeen ? 'text-gray-500' : 'text-black font-medium'
                        )}>
                        {lastMessageText}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ConversationBox;

//this renders either the group name or the other user's name
//{data.name || otherUser.name}