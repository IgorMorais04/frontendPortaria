import { useState } from "react";
import axios from "axios";

function SaidaViagem() {
  const [form, setForm] = useState({
    placaVeiculo: "",
    idMotorista: "",
    destino: "",
    passageiros: ""
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    axios
      .post("http://localhost:8080/api/viagens/saida", form)
      .then((res) => {
        setMsg(res.data || "Saída registrada com sucesso!");
        setLoading(false);
        setForm({
          placaVeiculo: "",
          idMotorista: "",
          destino: "",
          passageiros: ""
        });
      })
      .catch((err) => {
        setMsg(err.response?.data || "Erro ao registrar saída.");
        setLoading(false);
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Registrar Saída</h2>
      <form onSubmit={submit} style={styles.form}>
        <input
          name="placaVeiculo"
          placeholder="Placa do Veículo"
          value={form.placaVeiculo}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          name="idMotorista"
          placeholder="ID do Motorista"
          value={form.idMotorista}
          onChange={handleChange}
          style={styles.input}
          type="number"
          required
        />
        <input
          name="destino"
          placeholder="Destino"
          value={form.destino}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          name="passageiros"
          placeholder="Número de Passageiros"
          value={form.passageiros}
          onChange={handleChange}
          style={styles.input}
          type="number"
          min="1"
          required
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>
      {msg && <p style={styles.msg}>{msg}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "40px auto",
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f7f9fc",
    borderRadius: 8,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: 24,
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  input: {
    padding: "10px 12px",
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
    outline: "none",
    transition: "border-color 0.3s",
  },
  button: {
    padding: "12px",
    fontSize: 16,
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s",
  },
  msg: {
    marginTop: 20,
    color: "#333",
    fontWeight: "bold",
  },
};

export default SaidaViagem;
