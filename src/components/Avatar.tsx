import Image from "next/image";


export default function Avatar({
    src = "/imgs/butterfly-icon.png", 
    width = 100, 
    height = 100 
}: { 
    src?: string,
    width?: number, 
    height?: number 
}) {
    return (
        <div>
            <Image
                src={src}
                alt="avatar"
                width={width}
                height={height}
                className="rounded-full"
            />
        </div>
    )
}