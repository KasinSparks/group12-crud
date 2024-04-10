import { Link } from "react-router-dom"

export default function ResidentialDashboard() {
    return (
        <>
            <h1>Resedential Dashboard</h1>
            <Link to="/dashboard" className="dashLink">Dashboard</Link>
        </>
    )
}