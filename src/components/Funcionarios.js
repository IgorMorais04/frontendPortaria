import { useEffect, useState } from "react";
import axios from "axios";

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para formulário (novo ou editar)
  const [form, setForm] = useState({
    id: null,
    nome: "",
    cnh: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Buscar todos os funcionários
  const fetchFuncionarios = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/funcionario/listar")
      .then((res) => {
        setFuncionarios(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Erro ao buscar funcionários");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  // Atualiza o form conforme o input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Cadastrar ou editar funcionário
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nome.trim()) {
      alert("O nome é obrigatório");
      return;
    }

    if (isEditing) {
      // Editar
      axios
        .put("http://localhost:8080/api/funcionario/editar", form)
        .then(() => {
          fetchFuncionarios();
          resetForm();
        })
        .catch(() => alert("Erro ao editar funcionário"));
    } else {
      // Cadastrar
      axios
        .post("http://localhost:8080/api/funcionario/cadastrar", form)
        .then(() => {
          fetchFuncionarios();
          resetForm();
        })
        .catch(() => alert("Erro ao cadastrar funcionário"));
    }
  };

  // Preparar formulário para editar
  const handleEdit = (f) => {
    setForm({ id: f.id, nome: f.nome, cnh: f.cnh || "" });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" }); // rola pro topo para ver o form
  };

  // Excluir funcionário
  const handleDelete = (id) => {
    if (window.confirm("Deseja realmente excluir este funcionário?")) {
      axios
        .delete(`http://localhost:8080/api/funcionario/excluir/${id}`)
        .then(() => fetchFuncionarios())
        .catch(() => alert("Erro ao excluir funcionário"));
    }
  };

  const resetForm = () => {
    setForm({ id: null, nome: "", cnh: "" });
    setIsEditing(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>
          {isEditing ? "Editar Funcionário" : "Cadastrar Funcionário"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            name="cnh"
            placeholder="CNH (opcional)"
            value={form.cnh}
            onChange={handleChange}
            style={styles.input}
          />

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

        <h2 style={{ ...styles.title, marginTop: 40 }}>Funcionários Cadastrados</h2>

        {loading ? (
          <p style={styles.loading}>Carregando funcionários...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : funcionarios.length === 0 ? (
          <p style={styles.empty}>Nenhum funcionário encontrado.</p>
        ) : (
          <ul style={styles.list}>
            {funcionarios.map((f) => (
              <li key={f.id} style={styles.card}>
                <div>
                  <h3 style={styles.nome}>{f.nome}</h3>
                  <p style={styles.cnh}>
                    <strong>CNH:</strong> {f.cnh || "Não informado"}
                  </p>
                </div>
                <div style={styles.actions}>
                  <button
                    style={{ ...styles.btn, ...styles.editBtn }}
                    onClick={() => handleEdit(f)}
                    title="Editar funcionário"
                  >
                    Editar
                  </button>
                  <button
                    style={{ ...styles.btn, ...styles.deleteBtn }}
                    onClick={() => handleDelete(f.id)}
                    title="Excluir funcionário"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 10px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    backgroundColor: "#fafafa",
    borderRadius: "12px",
    maxWidth: "700px",
    width: "100%",
    padding: "30px 40px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  title: {
    fontWeight: "700",
    fontSize: "2.2rem",
    color: "#222",
    marginBottom: "30px",
    textAlign: "center",
    letterSpacing: "1.1px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  input: {
    padding: "10px 14px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  formButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  btn: {
    padding: "10px 22px",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "8px",
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
    textAlign: "center",
    fontStyle: "italic",
    color: "#777",
  },
  error: {
    textAlign: "center",
    color: "red",
    fontWeight: "700",
  },
  empty: {
    fontSize: "1.1rem",
    color: "#777",
    textAlign: "center",
    fontStyle: "italic",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px 25px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  nome: {
    margin: 0,
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#333",
  },
  cnh: {
    margin: "6px 0 0",
    color: "#444",
    fontWeight: "500",
    fontSize: "0.95rem",
  },
  actions: {
    display: "flex",
    gap: "14px",
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

export default Funcionarios;
