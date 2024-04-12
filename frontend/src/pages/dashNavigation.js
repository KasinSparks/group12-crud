import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function DashNavigation() {
    return (
    <nav className ="dashnav">
        <ul>
            <CustomLink to ="/dashboard/residentialdashboard">Resedential Dashboard</CustomLink>
            <CustomLink to ="/dashboard/residentialdevelopment">Resedential Development</CustomLink>
            <CustomLink to ="/dashboard/propertyinvestmentdashboard">Property Investment Dashboard</CustomLink>
            <CustomLink to ="/dashboard/monthlysalestrend">Monthly Sales Trend</CustomLink>
            <CustomLink to ="/dashboard/propertytypestrend">Property Types Trend</CustomLink>
            <CustomLink to ="/dashboard/humanimpactdashboard">Human Impact Dashboard</CustomLink>
            <CustomLink to ="/dashboard/environmentaldashboard">Environmental Dashboard</CustomLink>
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
