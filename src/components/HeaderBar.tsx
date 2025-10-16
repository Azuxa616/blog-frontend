
'use client'
import React from 'react'
import MenuButton from './MenuButton'
import { usePage } from '@/contexts/PageContext'



const menuItems = [
    { href: "/", label: "首页" },
    { href: "/about", label: "关于" },
    { href: "/links", label: "友链" },
]


export default function HeaderBar() {
  const { isExpanded } = usePage()

  const baseClasses = "fixed top-0 left-0 right-0 z-50 flex items-center justify-start w-full h-16 border px-8 gap-10 transition-colors duration-300"
  const variantClasses = isExpanded
    ? "bg-[#ffffffa0] text-black border-gray-200"
    : "bg-transparent text-white"

  return (
    <div className={`${baseClasses} ${variantClasses}`}>
        <div className='text-xl font-bold'>Azuxa&apos;s BlogSpace</div>
        <div className='flex items-center gap-4'>
            {menuItems.map((item) => (
                <MenuButton key={item.href} href={item.href} textColor={isExpanded ? 'black' : 'white'}>{item.label}</MenuButton>
            ))}

        </div>
    </div>
  )
}
