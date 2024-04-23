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
import TupleCount from './dashpages/tupleCount';
import DashNavigation from './dashNavigation';

export default function Dashboard() {
    return (
      
        <>
        <h1 className="dashHead">Dashboard</h1>
        <DashNavigation/>
        <div className="dashContainer">
        <h1>The Connecticut Real-Estate Unified Database</h1>
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
            <Route path="/dashboard/tupleCount" element={<TupleCount />} />
          </Routes>
        </div>
        </>
    )
    return <DashNavigation/>
}


      
 
