import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './pages/signup';
import SignIn from './pages/signin';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CustomNavbar from './pages/components/Navbar';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <Router>
      <CustomNavbar isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn onLogin={() => setIsLoggedIn(true)} />} />
        <Route
          path="/product/:productId/dashboard"
          element={<Dashboard isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
