"use client";
import { useState } from 'react'
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FieldValues, useForm } from 'react-hook-form';
import Input from "../Inputs/Input";
import Select from '../Inputs/Select';
import Modal from './Modal';
import Button from '../Button';
import axios from 'axios';
import { toast } from 'react-hot-toast';

type Props = {
    isOpen?: boolean;
    onClose: () => void;
    users: User[];
}

const GroupChatModal = ({ isOpen,onClose,users }: Props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            members: []
        }
    });
    const members = watch('members');
    const onSubmit = async (data: FieldValues) => {
        setIsLoading(true);
        try {
            const res = await axios.post('/api/conversations', {
                ...data,
                isGroup: true
            });
            if (res.status === 200) {
                router.refresh();
                onClose();
            } else {
                throw new Error("Something went wrong");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2
                            className="
                text-base 
                font-semibold 
                leading-7 
                text-gray-900
              "
                        >
                            Create a group chat
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Create a chat with more than 2 people.
                        </p>
                        <div className="mt-10 flex flex-col gap-y-8">
                            <Input
                                disabled={isLoading}
                                label="Name"
                                id="name"
                                errors={errors}
                                required
                                register={register}
                            />
                            <Select
                                disabled={isLoading}
                                label="Members"
                                options={users.map((user) => ({
                                    value: user.id,
                                    label: user.name
                                }))}
                                onChange={(value) => setValue('members', value, {
                                    shouldValidate: true
                                })}
                                value={members}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button
                        disabled={isLoading}
                        onClick={onClose}
                        type="button"
                        secondary
                    >
                        Cancel
                    </Button>
                    <Button disabled={isLoading} type="submit">
                        Create
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default GroupChatModal;