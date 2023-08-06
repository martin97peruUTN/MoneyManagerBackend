export const parseDate = (date: string | undefined): Date | undefined => {
    if (date) {
        const dateParsed = new Date(date)
        if (isNaN(dateParsed.getTime())) {
            return undefined
        }
        return dateParsed
    }
    return undefined
}

export const getFirstDayOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

export const getLastDayOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}