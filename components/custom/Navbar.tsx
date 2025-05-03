"use client";

import React from 'react'
import { Button } from '../ui/button';
import { FaGithub } from "react-icons/fa";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMenu } from '../UserMenu';
import Image from 'next/image';

const Navbar = () => {
    const pathname = usePathname();
    const isHome = pathname === '/';
    const isTodos = pathname === '/todos';

    return (
        <nav className={`z-50 ${isHome ? 
            'fixed top-4 left-1/2 w-3/4 transform -translate-x-1/2 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm' : 
            'relative top-0 bg-white dark:bg-neutral-950 shadow-md'} 
            p-4 transition-colors duration-200`}
        >
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <Button variant={'ghost'} className='text-xl font-bold dark:text-white'>
                    <Image 
                        src="/favicon.ico" 
                        alt="Tomados" 
                        width={28} 
                        height={28} 
                        className="mr-2 h-7 w-7" 
                    /> 
                    Tomados
                </Button>
                <ul className='flex space-x-4 items-center mt-5'>
                    <li>
                        <Link href={'/'}>
                            <Button variant={isHome ? "default" : "outline"} className='ml-2'>Home</Button>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/todos'}>
                            <Button variant={isTodos ? "default" : "outline"} className='ml-2 mr-2'>My Tasks</Button>
                        </Link>
                    </li>
                    <li>
                        <UserMenu />
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar