import React from "react"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import '../assets/css/nav.css'
import '../assets/css/vars/_nav.css';

interface NavProps extends React.PropsWithChildren<any> {
}
export default function Nav(props: NavProps) {
    return (
        <nav style={{...props.style}}><ul>{props.children}</ul></nav>
    )
}

interface NavItemProps extends React.PropsWithChildren<any> {
    icon?: string
    iconStyle?: React.CSSProperties
    hrefStyle?: React.CSSProperties
}

export function NavItem({icon, iconStyle, href, hrefStyle, onClick, ...props}: NavItemProps) {
    // @ts-ignore
    const iconProp: IconProp = icon

    return (
        <li style={{...props.style}}>
            <FontAwesomeIcon icon={iconProp} style={{...iconStyle}}/>
            <a style={{...hrefStyle}} href={href} onClick={onClick}>{props.children}</a>
        </li>
    )
}