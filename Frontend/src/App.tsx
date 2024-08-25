// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import SignUp from './pages/signup';
// import SignIn from './pages/singin';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route
          path="/home"
          element={<Home isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />}
        />

        {/* Sign Up Route */}
        <Route
        // path="/signup"
        // element={<SignUp isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />}
        />

        {/* Sign In Route */}
        <Route
        // path="/signin"
        // element={<SignIn isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />}
        />

        {/* Product-Specific Dashboard Route */}
        <Route
          path="/product/:productId/dashboard"
          element={<Dashboard isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />}
        />

        {/* Default Route (Redirect to Home or another component) */}
        <Route
          path="/"
          element={<Home isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />}
        />
      </Routes>
    </Router>
  );
};

export default App;