"use client";

import React from 'react'
import { Button } from '../ui/button';
import { FaGithub } from "react-icons/fa";
import { LuListTodo } from "react-icons/lu";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <nav className={`dark text-foreground z-50 ${isHome ? 'fixed top-4 left-1/2 w-3/4 transform -translate-x-1/2 bg-transparent' : 'realtive top-0 bg-background shadow-md'} p-4`}>
            <div className='container mx-auto flex justify-between items-center'>
                <Button variant={'ghost'} className='text-xl font-bold'>
                    <LuListTodo className='text-2xl mr-2' /> Todos app
                </Button>
                <ul className='flex space-x-4 '>
                    <li>
                        <Link href={'/'}>
                            <Button variant='default' className='ml-4'>Home</Button>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/todos'}>
                            <Button variant='outline' className='ml-4'>Todos list</Button>
                        </Link>
                    </li>
                    <li>
                        <Button variant='outline' className='ml-4'><FaGithub />Login</Button>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar