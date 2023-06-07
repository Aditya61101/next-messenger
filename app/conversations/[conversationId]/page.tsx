import EmptyState from '@/app/components/EmptyState';
import getConversationById from '@/app/utils/getConversationById';
import getMessages from '@/app/utils/getMessages';
import { FullConversationType } from '@/typings';
import { Conversation, Message, User } from '@prisma/client';
import React from 'react'
import Header from './components/Header';
import Body from './components/Body';
import { Form } from 'react-hook-form';

type Props = {
    params: {
        conversationId: string;
    }
}

const ConservationId = async ({ params: { conversationId } }: Props) => {
    const conversationPromise = getConversationById(conversationId);
    const messagesPromise = getMessages(conversationId);
    const [conversation, messages] = await Promise.all([conversationPromise, messagesPromise]);

    if (!conversation) {
        return (
          <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
              <EmptyState />
            </div>
          </div>
        )
      }
      return ( 
        <div className="lg:pl-80 h-full">
          <div className="h-full flex flex-col">
            <Header conversation={conversation} />
            <Body initialMessages={messages} />
            <Form />
          </div>
        </div>
      );
}

export default ConservationId;