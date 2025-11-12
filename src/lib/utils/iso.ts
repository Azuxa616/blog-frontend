/**
 * 将ISO字符串转换为日期输入值
 * @param value ISO字符串
 * @returns 日期输入值
 */
export const isoToInputValue = (value?: string) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    const pad = (num: number) => num.toString().padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
/**
 * 将日期字符串转换为ISO字符串
 * @param value 日期字符串
 * @returns ISO字符串
 */
export const toIsoString = (value?: string) => {
    if (!value) return undefined
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}
