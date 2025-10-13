"use client"
import { useRouter } from 'next/navigation'
export default function MenuButton({ children, href, textColor = 'white' }: { children: React.ReactNode, href: string, textColor?: string }) {
    const router = useRouter()

    const isWhiteText = textColor === 'white'

    return (
        <button
            onClick={() => router.push(href)}
            className={`relative px-4 py-2 transition-colors duration-200 font-semibold
                       after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1 after:h-0.5
                       after:transition-all after:duration-300 after:ease-out
                       hover:after:w-full ${isWhiteText ? 'hover:after:bg-white' : 'hover:after:bg-black'}`}
        >
            {children}
        </button>
    )
}