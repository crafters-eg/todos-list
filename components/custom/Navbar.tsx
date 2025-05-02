import React from 'react'
import { Button } from '../ui/button';
import { FaGithub } from "react-icons/fa";
import { LuListTodo } from "react-icons/lu";

const Navbar = () => {
    return (
        <nav className="dark bg-transparent fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-4xl rounded-2xl text-foreground p-4">
            <div className='container mx-auto flex justify-between items-center'>
                <Button variant={'ghost'} className='text-xl font-bold'>
                    <LuListTodo className='text-2xl mr-2' /> Todos app
                </Button>
                <ul className='flex space-x-4'>
                    <li>
                        <Button variant='default' className='ml-4'>Home</Button>
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