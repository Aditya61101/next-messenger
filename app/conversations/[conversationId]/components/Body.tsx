"use client";
import useConversation from '@/app/hooks/useConversation';
import { FullMessageType } from '@/typings';
import React, { useEffect, useRef, useState } from 'react'
import MessageBox from './MessageBox';
import axios from 'axios';
import { pusherClient } from '@/app/libs/pusher';

type Props = {
    initialMessages: FullMessageType[];
}

const Body = ({ initialMessages = [] }: Props) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState(initialMessages);

    const { conversationId } = useConversation();
    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

    useEffect(() => {
        pusherClient.subscribe(conversationId);
        bottomRef?.current?.scrollIntoView();

        const messageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`);

            setMessages((current) => {
                // if (find(current, { id: message.id })) {
                //     return current;
                // }
                if(current?.find((currentMessage) => currentMessage.id ===message.id))
                    return current;
                return [...current, message]
            });

            bottomRef?.current?.scrollIntoView();
        };

        //to update seen array of a message
        const updateMessageHandler = (newMessage: FullMessageType) => {
            setMessages((current) => current.map((currentMessage) => {
                if (currentMessage.id === newMessage.id)
                    return newMessage;
                
                return currentMessage;
            }))
        };


        pusherClient.bind('messages:new', messageHandler)
        pusherClient.bind('message:update', updateMessageHandler);

        return () => {
            pusherClient.unsubscribe(conversationId)
            pusherClient.unbind('messages:new', messageHandler)
            pusherClient.unbind('message:update', updateMessageHandler)
        }
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