"use client"
import { useRouter } from 'next/navigation'
export default function MenuButton({ children, href, textColor = 'white' }: { children: React.ReactNode, href: string, textColor?: string }) {
    const router = useRouter()

    const isWhiteText = textColor === 'white'

    return (
        <button
            onClick={() => router.push(href)}
            className="relative px-4 py-2 transition-colors duration-200 font-semibold
                       after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5
                       after:transition-all after:duration-300 after:ease-out
                       hover:after:w-full"
            style={{
                color: isWhiteText ? 'white' : 'black'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.color = isWhiteText ? '#9ca3af' : '#4b5563'
                const after = e.currentTarget.querySelector('::after') as HTMLElement
                if (after) {
                    after.style.backgroundColor = isWhiteText ? 'white' : 'black'
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.color = isWhiteText ? 'white' : 'black'
            }}
        >
            {children}
        </button>
    )
}