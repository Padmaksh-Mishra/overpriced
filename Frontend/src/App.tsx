// import {
//   BrowserRouter,
//   Route,
//   Routes,
// } from "react-router-dom";

// import SignUp  from "./pages/signup";
// import SignIn  from "./pages/signin";
// import Home  from "./pages/Home";
// import ProductDashboard from "./pages/product_dashboard";

// function App() {
//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/signin" element={<SignIn />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/product_dashboard" element={<ProductDashboard />} />
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;
// src/App.tsx
// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />} />
        <Route path="/dashboard" element={<Dashboard isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />} />
      </Routes>
    </Router>
  );
};

export default App;

