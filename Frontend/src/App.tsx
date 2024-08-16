import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import SignUp  from "./pages/signup";
import SignIn  from "./pages/signin";
import Home  from "./pages/home";
import ProductDashboard from "./pages/product_dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/product_dashboard" element={<ProductDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
