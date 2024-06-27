

import React, { ReactNode } from 'react'
import HeaderClasses from '../styles/Components/Header.module.css'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import {useRouter} from 'next/router'

type TBreadCrumbProps = {
    homeElement: ReactNode,
    separator: ReactNode,
    containerClasses?: string,
    listClasses?: string,
    activeClasses?: string,
    capitalizeLinks?: boolean
}

const NextBreadcrumb = ({homeElement, separator, containerClasses, listClasses, activeClasses, capitalizeLinks}: TBreadCrumbProps) => {
    const router = useRouter()
    const paths = usePathname()
    var included=router.pathname.includes("forgotten-password")||router.pathname.includes("thank-you")||router.pathname.includes("set-password")
    const pathNames = included?[]:paths.split('/').filter( path => path )

    return (
        <div className={HeaderClasses["breadcrumb-container"]}>
            <ul>
                {pathNames.length > 0 && separator?
                <li className={HeaderClasses["breadcrumb-element"]}><Link href={'/'} className={HeaderClasses["acc-link"]}>{homeElement}</Link>{separator}</li>:null}
            {
                pathNames.map( (link, index) => {
                    let href = `/${pathNames.slice(0, index + 1).join('/')}`
                    let itemClasses = paths === href ? `${listClasses} ${activeClasses}` : listClasses
                    let itemLink = capitalizeLinks ? link[0].toUpperCase() + link.slice(1, link.length) : link
                    return (
                        <React.Fragment key={index}>
                            <li className={HeaderClasses["breadcrumb-element"]} >
                                <Link href={href} className={HeaderClasses["acc-link"]}>{itemLink}</Link> 
                            {pathNames.length !== index + 1 && separator} 
                            </li>
                        </React.Fragment>
                    )
                })
        }
            </ul>
        </div>
    )
}

export default NextBreadcrumb
