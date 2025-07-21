import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Veiculos from "./components/Veiculos";
import Funcionarios from "./components/Funcionarios";
import SaidaViagem from "./components/SaidaViagem";
import RetornoViagem from "./components/RetornoViagem";

function App() {
  return (
    <Router>
      <nav style={styles.navbar}>
        <NavLink
          to="/veiculos"
          style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          Veículos
        </NavLink>
        <NavLink
          to="/funcionarios"
          style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          Funcionários
        </NavLink>
        <NavLink
          to="/saida"
          style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          Registrar Saída
        </NavLink>
        <NavLink
          to="/retorno"
          style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          Registrar Retorno
        </NavLink>
      </nav>

      <main style={styles.main}>
        <Routes>
          <Route path="/veiculos" element={<Veiculos />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/saida" element={<SaidaViagem />} />
          <Route path="/retorno" element={<RetornoViagem />} />
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <h2>Bem-vindo ao sistema!</h2>
                <p>Use a navegação acima para acessar as páginas.</p>
              </div>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}

const styles = {
  navbar: {
    padding: "15px 30px",
    borderBottom: "2px solid #eaeaea",
    backgroundColor: "#f8f9fa",
    display: "flex",
    gap: 20,
    justifyContent: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontWeight: "600",
    fontSize: 16,
  },
  link: {
    color: "#555",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 6,
    transition: "background-color 0.3s, color 0.3s",
  },
  activeLink: {
    color: "#fff",
    backgroundColor: "#007bff",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 6,
    boxShadow: "0 2px 6px rgba(0,123,255,0.5)",
  },
  main: {
    maxWidth: 900,
    margin: "30px auto",
    padding: 20,
  },
};

export default App;
