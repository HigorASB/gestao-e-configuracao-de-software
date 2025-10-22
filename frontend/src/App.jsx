import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    idade: ''
  })

  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    nome: '',
    email: '',
    idade: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  // Função para buscar usuários da API
  const fetchUsuarios = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:3333/usuarios')
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários')
      }
      const data = await response.json()
      setUsuarios(data)
    } catch (err) {
      setError('Erro ao carregar usuários: ' + err.message)
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  // Função para criar novo usuário
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await fetch('http://localhost:3333/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error('Erro ao cadastrar usuário')
      }
      
      // Limpar formulário após sucesso
      setFormData({ nome: '', email: '', idade: '' })
      
      // Atualizar lista de usuários
      fetchUsuarios()
      
      alert('Usuário cadastrado com sucesso!')
    } catch (err) {
      setError('Erro ao cadastrar: ' + err.message)
      console.error('Erro:', err)
    }
  }

  // Função para deletar usuário
  const handleDelete = async (userId, userName) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o usuário "${userName}"?`)
    
    if (!confirmDelete) return
    
    setError('')
    try {
      const response = await fetch(`http://localhost:3333/usuarios/${userId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Erro ao excluir usuário')
      }
      
      // Atualizar lista após exclusão
      fetchUsuarios()
      alert('Usuário excluído com sucesso!')
    } catch (err) {
      setError('Erro ao excluir: ' + err.message)
      console.error('Erro:', err)
    }
  }

  // Função para abrir modal de edição
  const handleEdit = (usuario) => {
    setEditingUser(usuario)
    setEditFormData({
      nome: usuario.nome,
      email: usuario.email,
      idade: usuario.idade.toString()
    })
    setShowEditModal(true)
  }

  // Função para fechar modal de edição
  const handleCloseEdit = () => {
    setShowEditModal(false)
    setEditingUser(null)
    setEditFormData({ nome: '', email: '', idade: '' })
  }

  // Função para atualizar dados do formulário de edição
  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  // Função para salvar edição
  const handleSaveEdit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await fetch(`http://localhost:3333/usuarios/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData)
      })
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar usuário')
      }
      
      // Fechar modal e atualizar lista
      handleCloseEdit()
      fetchUsuarios()
      alert('Usuário atualizado com sucesso!')
    } catch (err) {
      setError('Erro ao atualizar: ' + err.message)
      console.error('Erro:', err)
    }
  }

  // Carregar usuários quando o componente montar
  useEffect(() => {
    fetchUsuarios()
  }, [])

  return (
    <div className="container">
      <h1>Formulário de Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="idade">Idade:</label>
          <input
            type="number"
            id="idade"
            name="idade"
            value={formData.idade}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Enviar</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="usuarios-section">
        <div className="usuarios-header">
          <h2>Usuários Cadastrados</h2>
          <button 
            type="button" 
            onClick={fetchUsuarios} 
            className="refresh-btn"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>

        {loading && <div className="loading">Carregando usuários...</div>}
        
        {!loading && usuarios.length === 0 && (
          <div className="no-users">Nenhum usuário cadastrado ainda.</div>
        )}

        {!loading && usuarios.length > 0 && (
          <div className="usuarios-grid">
            {usuarios.map((usuario) => (
              <div key={usuario._id} className="usuario-card">
                <h3>{usuario.nome}</h3>
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>Idade:</strong> {usuario.idade} anos</p>
                <div className="card-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(usuario)}
                  >
                    Editar
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(usuario._id, usuario.nome)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {showEditModal && (
        <div className="modal-overlay" onClick={handleCloseEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Usuário</h2>
              <button className="close-btn" onClick={handleCloseEdit}>×</button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="edit-form">
              <div className="form-group">
                <label htmlFor="edit-nome">Nome:</label>
                <input
                  type="text"
                  id="edit-nome"
                  name="nome"
                  value={editFormData.nome}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-email">Email:</label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-idade">Idade:</label>
                <input
                  type="number"
                  id="edit-idade"
                  name="idade"
                  value={editFormData.idade}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseEdit}>
                  Cancelar
                </button>
                <button type="submit" className="save-btn">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
