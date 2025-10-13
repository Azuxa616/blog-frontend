export default function FooterBar() {
    return (
        <footer className="w-full h-16 bg-[#254889] row-start-3 flex gap-[24px] flex-wrap items-center justify-center relative z-10">
            <span className="text-sm text-white font-semibold">
                © {new Date().getFullYear()} By Azuxa616
            </span>
            <span className="text-xs text-gray-200">
                由 Next.js & Tailwind CSS 强力驱动
            </span>
        </footer>
    )
}


