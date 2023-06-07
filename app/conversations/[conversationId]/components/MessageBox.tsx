import Avatar from '@/app/components/Avatar';
import { FullMessageType } from '@/typings'
import clsx from 'clsx';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import Image from 'next/image';

type Props = {
    data: FullMessageType;
    isLast: boolean;
}

const MessageBox = ({ data, isLast }: Props) => {
    const session = useSession();
    const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);

    //to check whether the message is sent by me or not
    const isOwn = session.data?.user?.email === data?.sender?.email;
    // a string of users which will see my message except me
    const seenList = (data.seenBy || []).filter((user) => user.email !== data?.sender?.email).map((user) => user.name).join(', ');

    //classes for styling
    const containerClass = clsx('flex gap-3 p-4', isOwn && 'justify-end');
    const avatarClass = clsx(isOwn && 'order-2');
    const bodyClass = clsx('flex flex-col gap-2', isOwn && 'items-end');
    const messageClass = clsx(
        'text-sm w-fit overflow-hidden',
        isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100',
        data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
    );
    return (
        <div className={containerClass}>
            <div className={avatarClass}>
                <Avatar user={data.sender} />
            </div>
            <div className={bodyClass}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500">
                        {data.sender.name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {format(new Date(data.createdAt), 'p')}
                    </div>
                </div>
                <div className={messageClass}>
                    {/* <ImageModal src={data.image} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} /> */}
                    {data.image ? (
                        <Image
                            alt="Image"
                            height="288"
                            width="288"
                            onClick={() => setImageModalOpen(true)}
                            src={data.image}
                            className="
                object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate
              "
                        />
                    ) : (
                        <div>{data.body}</div>
                    )}
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <div
                        className="
            text-xs 
            font-light 
            text-gray-500
            "
                    >
                        {`Seen by ${seenList}`}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MessageBox;