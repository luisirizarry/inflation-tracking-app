// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/common/NavBar";
import AppRoutes from "./routes/AppRoutes";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import "./App.css";

function App() {
  const { login, signup } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <main className="container">
          <AppRoutes login={login} signup={signup} />
        </main>
        <footer className="footer">
          <p>© {new Date().getFullYear()} Inflation Tracker</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;