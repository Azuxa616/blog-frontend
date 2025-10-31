import FooterBar from "@/components/FooterBar";
export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-8">
            {children}
            <FooterBar />
        </div>
    )
}