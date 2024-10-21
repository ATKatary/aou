import { LinkProps } from "react-router-dom"
import { navStateType } from "../../types"

export type NavProps = JSX.IntrinsicElements["nav"] & {
}

export type NavItemProps = JSX.IntrinsicElements["nav"] & {
    icon?: string
    state: navStateType
    iconStyle?: React.CSSProperties
    hrefStyle?: React.CSSProperties
}

export type NavCrumbItemProps = LinkProps & {
    to: string
    state: navStateType
}

export type NavCrumbsProps = JSX.IntrinsicElements["header"] & {    
}