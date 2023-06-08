"use client";
import React, { useCallback, useEffect, useState } from 'react'
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
//icons
import { BsGithub, BsGoogle } from 'react-icons/bs';
//components
import AuthSocialButton from './AuthSocialButton';
import Input from '@/app/components/Inputs/Input';
import Button from '@/app/components/Button';
//api callers
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
//toast
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        if (session?.status === 'authenticated') {
            console.log(session?.status);
            router.push('/users');
        }
    }, [session?.status, router]);
    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN')
            setVariant('REGISTER');
        else
            setVariant('LOGIN');
    }, [variant]);
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: '',
            name: ''
        }
    })
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        if (variant === 'LOGIN') {
            try {
                const response = await signIn('credentials', {
                    ...data,
                    redirect: false
                });
                if (response?.error) {
                    throw new Error("Invalid credentials");
                } else if (response?.ok) {
                    toast.success("Logged in successfully! 🎉");
                    router.push('/users');
                }
            } catch (error) {
                toast.error("Invalid credentials");
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                const response = await axios.post('/api/register', data);
                console.log(response);
                if (response.status === 200) {
                    toast.success("Account created successfully! 🎉");
                    await signIn('credentials', data);
                    console.log(response.data);
                } else {
                    throw new Error("Login Failed");
                }
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        }
    }
    const socialAction = async (provider: string) => {
        setIsLoading(true);
        try {
            const response = await signIn(provider, { redirect: false });
            if (response?.error) {
                throw new Error("Invalid credentials");
            } else if (response?.ok) {
                toast.success("Logged in successfully! 🎉");
                router.push('/users');
            }
        } catch (error) {
            toast.error("Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
                    {variant === 'REGISTER' && (
                        <Input
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                            id="name"
                            label="Name"
                        />
                    )}
                    <Input
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                        id="email"
                        label="Email address"
                        type="email"
                    />
                    <Input
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                        id="password"
                        label="Password"
                        type="password"
                    />
                    <div>
                        <Button disabled={isLoading} fullWidth type="submit">
                            {variant === 'LOGIN' ? 'Sign in' : 'Register'}
                        </Button>
                    </div>
                </form>
                <div className='mt-6'>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={() => socialAction('github')}
                        />
                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={() => socialAction('google')}
                        />
                    </div>
                </div>
                <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                    <div>
                        {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
                    </div>
                    <div
                        onClick={toggleVariant}
                        className="underline cursor-pointer"
                    >
                        {variant === 'LOGIN' ? 'Create an account' : 'Login'}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthForm;