"use client";
import useConversation from '@/app/hooks/useConversation';
import { FullMessageType } from '@/typings';
import React, { useEffect, useRef, useState } from 'react'
import MessageBox from './MessageBox';
import axios from 'axios';

type Props = {
    initialMessages: FullMessageType[]|null;
}

const Body = ({ initialMessages = [] }: Props) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState(initialMessages);

    const { conversationId } = useConversation();
    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);
    return (
        <div className='flex-1 overflow-y-auto'>
            {messages?.map((message, i) => (
                <MessageBox
                    key={message.id}
                    isLast={i === messages?.length - 1}
                    data={message}
                />
            ))}
            <div className="pt-24" ref={bottomRef} />
        </div>
    )
}

export default Body;