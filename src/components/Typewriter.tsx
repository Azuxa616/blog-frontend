'use client'

import React, { useState, useEffect, useCallback } from 'react'

interface TypewriterProps {
    initialText?: string // 初始文本,组件初始化时显示
    repeatedTextList?: string[] // 重复文本列表,组件在初始文本显示完后,会依次显示列表中的文本
    initialTypingSpeed?: number // 初始文本打字速度,单位:毫秒
    repeatedTypingSpeed?: number // 重复文本打字速度,单位:毫秒
    gapInterval?: number // 重复文本之间的间隔时间,单位:毫秒
    loop?: boolean // 是否循环显示,(默认:true)
    deleteSpeed?: number // 重复文本的删除速度,单位:毫秒
    cursor?: string // 光标符号(置空则不显示光标)
    cursorBlinkInterval?: number // 光标闪烁间隔,单位:毫秒
    className?: string // 类名
}

type Phase = 'initial' | 'waiting' | 'typing' | 'deleting' | 'complete'

export default function Typewriter({
    initialText = '',
    repeatedTextList = [],
    initialTypingSpeed = 100,
    repeatedTypingSpeed = 100,
    gapInterval = 2000,
    loop = true,
    deleteSpeed = 50,
    cursor = '|',
    cursorBlinkInterval = 500,
    className = ''
}: TypewriterProps) {
    const [displayedInitialText, setDisplayedInitialText] = useState('')
    const [dynamicText, setDynamicText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [phase, setPhase] = useState<Phase>('initial')
    const [showCursor, setShowCursor] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    // 光标闪烁效果
    useEffect(() => {
        if (!cursor) return

        const blinkInterval = setInterval(() => {
            setShowCursor(prev => !prev)
        }, cursorBlinkInterval)

        return () => clearInterval(blinkInterval)
    }, [cursor, cursorBlinkInterval])

    // 获取当前要显示的动态文本
    const getCurrentTargetText = useCallback(() => {
        if (repeatedTextList.length > 0) {
            return repeatedTextList[currentIndex]
        }
        return ''
    }, [repeatedTextList, currentIndex])

    // 主逻辑处理
    useEffect(() => {
        const targetText = getCurrentTargetText()

        switch (phase) {
            case 'initial':
                if (initialText) {
                    if (displayedInitialText.length < initialText.length) {
                        const timer = setTimeout(() => {
                            setDisplayedInitialText(initialText.slice(0, displayedInitialText.length + 1))
                        }, initialTypingSpeed)
                        return () => clearTimeout(timer)
                    } else {
                        // 初始文本打字完成，开始循环显示重复文本
                        if (repeatedTextList.length > 0) {
                            setPhase('waiting')
                        } else {
                            setPhase('complete')
                        }
                    }
                } else {
                    setPhase('waiting')
                }
                break

            case 'waiting':
                setIsDeleting(prev => !prev)
                if (repeatedTextList.length > 0) {
                    const timer = setTimeout(() => {
                        setPhase(isDeleting ? 'deleting' : 'typing')

                    }, gapInterval)
                    return () => clearTimeout(timer)
                }
                break

            case 'typing':
                if (dynamicText.length < targetText.length) {
                    const timer = setTimeout(() => {
                        setDynamicText(targetText.slice(0, dynamicText.length + 1))
                    }, repeatedTypingSpeed)
                    return () => clearTimeout(timer)
                } else {
                    // 打字完成，开始删除
                    setPhase('waiting')
                }
                break

            case 'deleting':
                if (dynamicText.length > 0) {
                    const timer = setTimeout(() => {
                        setDynamicText(dynamicText.slice(0, -1))
                    }, deleteSpeed)
                    return () => clearTimeout(timer)
                } else {
                    // 删除完成，进入下一个循环
                    const nextIndex = (currentIndex + 1) % repeatedTextList.length
                    setCurrentIndex(nextIndex)

                    if (loop || nextIndex !== 0) {
                        setPhase('waiting')
                    } else {
                        setPhase('complete')
                    }
                }
                break

            case 'complete':
                // 完成状态，不执行任何操作
                break
        }
    }, [
        phase,
        displayedInitialText,
        dynamicText,
        currentIndex,
        initialText,
        repeatedTextList,
        initialTypingSpeed,
        repeatedTypingSpeed,
        gapInterval,
        deleteSpeed,
        loop,
        getCurrentTargetText
    ])

    return (
        <span className={className}>
            {displayedInitialText}
            {dynamicText}
            {cursor && showCursor && <span>{cursor}</span>}
        </span>
    )
}