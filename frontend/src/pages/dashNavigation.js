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
            //<CustomLink to ="/dashboard/residentialdashboard">Residential Dashboard</CustomLink>
            //<CustomLink to ="/dashboard/propertyinvestmentdashboard">Property Investment Dashboard</CustomLink>
            //<CustomLink to ="/dashboard/humanimpactdashboard">Human Impact Dashboard</CustomLink>
            //<CustomLink to ="/dashboard/environmentaldashboard">Environmental Dashboard</CustomLink>

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath (to)
    const isActive = useMatch({path: resolvedPath.pathname, end: true})
    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>{children}</Link>
        </li>
    )
}
