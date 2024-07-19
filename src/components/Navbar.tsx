import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from "@/components/ui/button"


const Navbar = ()=> {
    const user = false
    const isAdmin = true
    return (
        <nav className="sticky inset-x-0 top-0 z-1000 h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
            <div className='h-14 flex items-center justify-between border-b border-zinc-200'>
                <Link className='flex z-40 font-semibold' href="/">case
                <span className='text-green-600'>cobra</span>
                </Link>

                <div className="h-full flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link href="/api/auth/logout">
                                Sign Out
                            </Link>
                            {isAdmin ? (
                                <Link href = "">
                                    Dashboard ✨
                                </Link>
                            ):
                            null}
                        <Link
                        className={buttonVariants(
                            {size:'sm',className:'hidden sm:flex items-center gap-1'}
                        )}
                        href="/configure/upload">
                                Create case
                                <ArrowRight className='ml-1.5 h-5 w-5'/>
                        </Link>
                        </>
                    ):
                    (
                    <>
                            <Link href="/api/auth/register">
                                Sign up
                            </Link>

                            <Link href="/api/auth/login">
                                Login
                            </Link>

                            <div className='h-8 w-px bg-zinc-200 hidden sm:block'/>
                            <Link className={
                                buttonVariants({size:'sm',className:'hidden sm:flex items-center gap-1'
                            })} href="/configure/upload">
                                Create case
                                <ArrowRight className='ml-1.5 h-5 w-5'/>
                            </Link>
                    </>
                    )
                    }
                </div>
            </div>
            </MaxWidthWrapper>
        </nav>
    )
}


export default Navbar