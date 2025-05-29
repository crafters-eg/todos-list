"use client";

import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { FaGithub } from "react-icons/fa";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMenu } from '../UserMenu';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname();
    const isHome = pathname === '/';
    const isTodos = pathname === '/todos';

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 w-full z-50 p-4 transition-colors duration-500 ease-in-out backdrop-blur-sm",
                isHome && !scrolled
                    ? "bg-white/80 dark:bg-neutral-950/80 md:w-3/4 md:left-1/2 md:transform md:-translate-x-1/2 top-4"
                    : "bg-white dark:bg-neutral-950 shadow-md",
                scrolled && "bg-white/90 dark:bg-neutral-950/90 shadow-md"
            )}
        >
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center transition-all duration-500 ease-in-out">
                <Button variant={'ghost'} className='text-2xl md:text-xl font-semibold md:font-bold dark:text-white'>
                    <Image
                        src="/favicon.ico"
                        alt="Tomados"
                        width={32}
                        height={32}
                        className="mr-2 h-9 w-9"
                    />
                    Tomados
                </Button>
                <ul className='flex justify-between md:justify-end w-full space-x-4 items-center mt-5 px-2'>
                    <div className='flex space-x-4'>
                        <li>
                            <Link href={'/'}>
                                <Button variant={isHome ? "default" : "outline"} className='ml-2'>Home</Button>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/todos'}>
                                <Button variant={isTodos ? "default" : "outline"} className='ml-2'>My Tasks</Button>
                            </Link>
                        </li>
                    </div>
                    <li>
                        <UserMenu />
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar