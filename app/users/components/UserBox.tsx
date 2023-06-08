"use client";
import Avatar from '@/app/components/Avatar';
import LoadingModal from '@/app/components/Modals/LoadingModal';
import { User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react'
import { toast } from 'react-hot-toast';

type Props = {
    data: User;
}
const UserBox = ({ data }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const handleClick = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.post('/api/conversations', {
                userId: data.id
            });
            if (res.status === 200) {
                router.push(`/conversations/${res.data.conversation.id}`);
            } else {
                throw new Error('Something went wrong');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }, [data, router]);
    return (
        <>
            {loading && (
                <LoadingModal />
            )}
            <div
                onClick={handleClick}
                className="
          w-full 
          relative 
          flex 
          items-center 
          space-x-3 
          bg-white 
          p-3 
          hover:bg-neutral-100
          rounded-lg
          transition
          cursor-pointer
        "
            >
                <Avatar user={data} />
                <div className="min-w-0 flex-1">
                    <div className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-gray-900">
                                {data.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div></>
    )
}

export default UserBox;