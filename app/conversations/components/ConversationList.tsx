"use client";

import { useState, useMemo, useEffect } from 'react'
import useConversation from '@/app/hooks/useConversation';
import { FullConversationType } from '@/typings';
import { Conversation, User } from '@prisma/client';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import ConversationBox from './ConversationBox';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import GroupChatModal from '@/app/components/Modals/GroupChatModal';

type Props = {
    items: FullConversationType[];
    users: User[];
    title?: string;
}

const ConversationList = ({ items, users, title }: Props) => {
    const [conversations, setConversations] = useState<FullConversationType[]>(items);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const router = useRouter();
    const session = useSession();
    const { isOpen, conversationId } = useConversation();
    return (
        <>
            <GroupChatModal
                users={users}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <aside className={clsx(`
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200 
      `, isOpen ? 'hidden' : 'block w-full left-0')}>
                <div className="px-5">
                    <div className="flex justify-between mb-4 pt-4">
                        <div className="text-2xl font-bold text-neutral-800">
                            Messages
                        </div>
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="
                rounded-full 
                p-2 
                bg-gray-100 
                text-gray-600 
                cursor-pointer 
                hover:opacity-75 
                transition
              "
                        >
                            <MdOutlineGroupAdd size={20} />
                        </div>
                    </div>
                    {items.map((item) => (
                        <ConversationBox
                            key={item.id}
                            data={item}
                            selected={conversationId === item.id}
                        />
                    ))}
                </div>
            </aside>
        </>
    )
}

export default ConversationList;