import { useEffect, useState } from "react";
import axios from "axios";

function Veiculos() {
  const [status, setStatus] = useState("NO_PATIO");
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form para cadastro/edição
  const [form, setForm] = useState({
    id: null,
    placa: "",
    modelo: "",
    status: "NO_PATIO",
  });
  const [isEditing, setIsEditing] = useState(false);

  const statusLabel = {
    NO_PATIO: "No Pátio",
    VIAGEM: "Em Viagem",
  };

  // Buscar veículos, com filtro de status
  const fetchVeiculos = () => {
    setLoading(true);
    setError(null);
    // Pode usar endpoint listarPorStatus ou filtrar no frontend, aqui vamos usar o endpoint sem filtro
    axios
      .get("http://localhost:8080/api/veiculo/listar")
      .then((res) => {
        setVeiculos(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Erro ao buscar veículos");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVeiculos();
  }, []);

  // Veículos filtrados por status
  const veiculosFiltrados = veiculos.filter(
    (v) => v.status?.toUpperCase() === status
  );

  // Atualiza formulário
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envia cadastro ou edição
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.placa.trim() || !form.modelo.trim()) {
      alert("Placa e Modelo são obrigatórios");
      return;
    }

    if (isEditing) {
      axios
        .put("http://localhost:8080/api/veiculo/editar", form)
        .then(() => {
          fetchVeiculos();
          resetForm();
        })
        .catch(() => alert("Erro ao editar veículo"));
    } else {
      axios
        .post("http://localhost:8080/api/veiculo/cadastrar", form)
        .then(() => {
          fetchVeiculos();
          resetForm();
        })
        .catch(() => alert("Erro ao cadastrar veículo"));
    }
  };

  // Prepara form para edição
  const handleEdit = (v) => {
    setForm({
      id: v.id,
      placa: v.placa,
      modelo: v.modelo,
      status: v.status || "NO_PATIO",
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Excluir veículo
  const handleDelete = (id) => {
    if (window.confirm("Deseja realmente excluir este veículo?")) {
      axios
        .delete(`http://localhost:8080/api/veiculo/excluir/${id}`)
        .then(() => fetchVeiculos())
        .catch(() => alert("Erro ao excluir veículo"));
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setForm({ id: null, placa: "", modelo: "", status: "NO_PATIO" });
    setIsEditing(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {isEditing ? "Editar Veículo" : "Cadastrar Veículo"}
      </h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="placa"
          placeholder="Placa"
          value={form.placa}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          name="modelo"
          placeholder="Modelo"
          value={form.modelo}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="NO_PATIO">No Pátio</option>
          <option value="VIAGEM">Em Viagem</option>
        </select>

        <div style={styles.formButtons}>
          <button type="submit" style={{ ...styles.btn, ...styles.saveBtn }}>
            {isEditing ? "Salvar" : "Cadastrar"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              style={{ ...styles.btn, ...styles.cancelBtn }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2 style={{ ...styles.title, marginTop: 40 }}>
        Veículos - {statusLabel[status]}
      </h2>

      <select
        onChange={(e) => setStatus(e.target.value)}
        value={status}
        style={styles.select}
      >
        <option value="NO_PATIO">No Pátio</option>
        <option value="VIAGEM">Em Viagem</option>
      </select>

      {loading ? (
        <p style={styles.loading}>Carregando veículos...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : veiculosFiltrados.length === 0 ? (
        <p style={styles.noResults}>Nenhum veículo encontrado.</p>
      ) : (
        <ul style={styles.list}>
          {veiculosFiltrados.map((v) => (
            <li key={v.id} style={styles.listItem}>
              <div>
                <strong>{v.placa}</strong> — {v.modelo}
              </div>
              <div style={styles.actions}>
                <span style={styles.statusBadge}>{statusLabel[v.status]}</span>
                <button
                  style={{ ...styles.btn, ...styles.editBtn }}
                  onClick={() => handleEdit(v)}
                  title="Editar veículo"
                >
                  Editar
                </button>
                <button
                  style={{ ...styles.btn, ...styles.deleteBtn }}
                  onClick={() => handleDelete(v.id)}
                  title="Excluir veículo"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f7f9fc",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 24,
  },
  input: {
    padding: "10px 12px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  select: {
    padding: "10px 12px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 16,
    cursor: "pointer",
  },
  formButtons: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
  },
  btn: {
    padding: "8px 18px",
    fontSize: 16,
    fontWeight: "600",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  saveBtn: {
    backgroundColor: "#4a90e2",
    color: "#fff",
  },
  cancelBtn: {
    backgroundColor: "#aaa",
    color: "#fff",
  },
  loading: {
    color: "#777",
    fontStyle: "italic",
    textAlign: "center",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
  noResults: {
    textAlign: "center",
    color: "#555",
    fontStyle: "italic",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    backgroundColor: "#fff",
    padding: "12px 16px",
    marginBottom: 8,
    borderRadius: 4,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 16,
  },
  statusBadge: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "3px 8px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
    marginRight: 12,
  },
  actions: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: "#4a90e2",
    color: "#fff",
  },
  deleteBtn: {
    backgroundColor: "#e94e4e",
    color: "#fff",
  },
};

export default Veiculos;
