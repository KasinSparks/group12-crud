import { Link, Route, Routes } from 'react-router-dom';
import ResidentialDashboard from './dashpages/residentalDashboard';
import ResidentialDevelopment from './dashpages/residentialDevelopment';
import PropertyInvestment from './dashpages/propertyInvestment';
import MonthlySales from './dashpages/monthlySales';
import PropertyTypes from './dashpages/propertyTypes';
import HumanImpact from './dashpages/humanImpact';
import Environmental from './dashpages/environmental';
import Criminal from './dashpages/criminal';
import Transportation from './dashpages/transportation';
import DashNavigation from './dashNavigation';

export default function Dashboard() {
    return (
        <>
        <h1>Dashboard</h1>
        <a>Links will be altered to a user friendly format. (Short descriptions for each?)</a>
        <DashNavigation/>
        <div className="dashContainer">
          <Routes>
            <Route path="/dashboard/residentialdashboard" element={<ResidentialDashboard />} />
            <Route path="/dashboard/residentialdevelopment" element={<ResidentialDevelopment />} />
            <Route path="/dashboard/propertyinvestmentdashboard" element={<PropertyInvestment />} />
            <Route path="/dashboard/monthlysalestrend" element={<MonthlySales />} />
            <Route path="/dashboard/propertytypestrend" element={<PropertyTypes />} />
            <Route path="/dashboard/humanimpactdashboard" element={<HumanImpact />} />
            <Route path="/dashboard/environmentaldashboard" element={<Environmental />} />
            <Route path="/dashboard/criminalimpact" element={<Criminal />} />
            <Route path="/dashboard/transportationimpact" element={<Transportation />} />
          </Routes>
        </div>
        </>
    )
    return <DashNavigation/>
}


      
 