import React from 'react'
import MenuButton from './MenuButton'



const menuItems = [
    { href: "/", label: "首页" },
    { href: "/about", label: "关于" },
    { href: "/links", label: "友链" },
]


export default function HeaderBar({ backgroundColor }: { backgroundColor: string }) {
  const textColor = backgroundColor === 'white' ? 'black' : 'white'

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full h-16 border px-8" style={{ backgroundColor, color: textColor }}>
        <div className='text-xl font-bold'>Azuxa's BlogSpace</div>
        <div className='flex items-center gap-4'>
            <select className='font-bold bg-transparent text-white'>
                <option className='text-black bg-none' value="zh">中文</option>
                <option className='text-black bg-none' value="en">English</option>
            </select>
            {menuItems.map((item) => (
                <MenuButton key={item.href} href={item.href} textColor={textColor}>{item.label}</MenuButton>
            ))}
            
        </div>
    </div>
  )
}
