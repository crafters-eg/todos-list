import React from 'react'
import { Button } from '../ui/button';
import { FaGithub } from "react-icons/fa";
import { LuListTodo } from "react-icons/lu";

const Navbar = () => {
    return (
        <nav className='bg-background dark text-foreground p-4 shadow-md'>
            <div className='container mx-auto flex justify-between items-center'>
                <Button variant={'ghost'} className='text-xl font-bold'>
                    <LuListTodo className='text-2xl mr-2' /> Todos app
                </Button>
                <ul className='flex space-x-4'>
                    <li>
                        <Button variant='outline' className='ml-4'>Home</Button>
                    </li>
                    <li>
                        <Button variant='outline' className='ml-4'>Todos list</Button>
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