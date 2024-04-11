import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function Navigation() {
    return (
    <nav className ="nav">
        <Link to="/" className="site-title">CRUD</Link>
        <ul>
            <CustomLink to ="/map">Map</CustomLink>
            <CustomLink to ="/dashboard">Dashboard</CustomLink>
            <CustomLink to ="/about">About</CustomLink>
            <CustomLink to ="/login">Login</CustomLink>
            <CustomLink to ="/register">Register</CustomLink>
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
