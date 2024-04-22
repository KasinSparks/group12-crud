import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function DashNavigation() {
    return (
    <nav className ="dashnav">
        <ul>
            <CustomLink to ="/dashboard/residentialdevelopment">Residential Development</CustomLink>
            <CustomLink to ="/dashboard/monthlysalestrend">Monthly Sales Trend</CustomLink>
            <CustomLink to ="/dashboard/propertytypestrend">Property Types Trend</CustomLink>
            <CustomLink to ="/dashboard/criminalimpact">Criminal Impact</CustomLink>
            <CustomLink to ="/dashboard/transportationimpact">Transportation Impact</CustomLink>
            <CustomLink to ="/dashboard/tupleCount">Tuple Count</CustomLink>
        </ul>
    </nav>
    )
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath (to)
    const isActive = useMatch({path: resolvedPath.pathname, end: true})
    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>{children}</Link>
        </li>
    )
}
