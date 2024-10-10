export type themeType = {
    bg: themeEntryType
}

export type themeEntryType = {
    [key: string]: string
}

export type themeContextType = {
    theme: themeType
    setTheme: (theme: themeType) => void
}

export type dataType = {
    id: string
    icon: string
    title: string
}