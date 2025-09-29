import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Companies from "./Companies";

import SlotMachines from "./SlotMachines";

import Metrology from "./Metrology";
import MetrologyApprovals from "./MetrologyApprovals";
import MetrologyCommissions from "./MetrologyCommissions";
import MetrologyAuthorities from "./MetrologyAuthorities";
import MetrologySoftware from "./MetrologySoftware";

import Locations from "./Locations";

import Providers from "./Providers";

import Cabinets from "./Cabinets";

import GameMixes from "./GameMixes";

import Platforms from "./Platforms";

import Invoices from "./Invoices";

import Jackpots from "./Jackpots";

import Users from "./Users";

import Warehouse from "./Warehouse";

import ONJNReports from "./ONJNReports";

import LegalDocuments from "./LegalDocuments";

import SlotMachineDetail from "./SlotMachineDetail";

import GameMixDetail from "./GameMixDetail";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Companies: Companies,
    
    SlotMachines: SlotMachines,
    
    Metrology: Metrology,
    MetrologyApprovals: MetrologyApprovals,
    MetrologyCommissions: MetrologyCommissions,
    MetrologyAuthorities: MetrologyAuthorities,
    
    Locations: Locations,
    
    Providers: Providers,
    
    Cabinets: Cabinets,
    
    GameMixes: GameMixes,
    
    Platforms: Platforms,
    
    Invoices: Invoices,
    
    Jackpots: Jackpots,
    
    Users: Users,
    
    Warehouse: Warehouse,
    
    ONJNReports: ONJNReports,
    
    LegalDocuments: LegalDocuments,
    
    SlotMachineDetail: SlotMachineDetail,
    
    GameMixDetail: GameMixDetail,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Companies" element={<Companies />} />
                
                <Route path="/SlotMachines" element={<SlotMachines />} />
                
                <Route path="/Metrology" element={<Metrology />} />
                <Route path="/MetrologyApprovals" element={<MetrologyApprovals />} />
                <Route path="/MetrologyCommissions" element={<MetrologyCommissions />} />
                <Route path="/MetrologyAuthorities" element={<MetrologyAuthorities />} />
                <Route path="/MetrologySoftware" element={<MetrologySoftware />} />
                
                <Route path="/Locations" element={<Locations />} />
                
                <Route path="/Providers" element={<Providers />} />
                
                <Route path="/Cabinets" element={<Cabinets />} />
                
                <Route path="/GameMixes" element={<GameMixes />} />
                
                <Route path="/Platforms" element={<Platforms />} />
                
                <Route path="/Invoices" element={<Invoices />} />
                
                <Route path="/Jackpots" element={<Jackpots />} />
                
                <Route path="/Users" element={<Users />} />
                
                <Route path="/Warehouse" element={<Warehouse />} />
                
                <Route path="/ONJNReports" element={<ONJNReports />} />
                
                <Route path="/LegalDocuments" element={<LegalDocuments />} />
                
                <Route path="/SlotMachineDetail" element={<SlotMachineDetail />} />
                
                <Route path="/game-mix-detail" element={<GameMixDetail />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router basename="/cashpot-v7">
            <PagesContent />
        </Router>
    );
}