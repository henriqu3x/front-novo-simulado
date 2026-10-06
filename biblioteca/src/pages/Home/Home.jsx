import { useEffect, useState } from 'react'
import api from '../../services/api'
import logo from '../../assets/logo-bg.png'
import dataConvertida from '../../services/dataConvertida'
import Toast from '../../components/Toast/Toast'
import {useAuth} from '../../contexts/AuthContext'
import Modal from '../../components/Modal/Modal'
import './home.css'

const Home = () => {
  const [usuarios, setUsuarios] = useState([])
  const [autores, setAutores] = useState([])
  const [categorias, setCategorias] = useState([])
  const [livros, setLivros] = useState([])
  const [exemplares, setExemplares] = useState([])
  const [emprestimos, setEmprestimos] = useState([])
  const [devolucoes, setDevolucoes] = useState([])

  const [error,setError] = useState('')
  const [msg,setMsg] = useState('')

  const [tab,setTab] = useState('usuarios')

  const [modal,setModal] = useState({open: false, mode: 'add', register: null})

  const {logout, isAdmin, user} = useAuth()

  const buscarAPI = async () => {
    try {
      setError('')
      const resultUsuarios = await api.get('/usuarios')
      const resultAutores = await api.get('/autores')
      const resultCategorias = await api.get('/categorias')
      const resultLivros = await api.get('/livros')
      const resultExemplares = await api.get('/exemplares')
      const resultEmprestimos = await api.get('/emprestimos')
      const resultDevolucoes = await api.get('/devolucoes')

      setUsuarios(resultUsuarios.data)
      setAutores(resultAutores.data)
      setCategorias(resultCategorias.data)
      setLivros(resultLivros.data)
      setExemplares(resultExemplares.data)
      setEmprestimos(resultEmprestimos.data)
      setDevolucoes(resultDevolucoes.data)

    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message

      setError(message)
    }
  }

  useEffect(() => {
    buscarAPI()
  },[])


  //FILTROS

  const exemplaresDisponiveis = exemplares.filter((e) => e.ativo && e.status == 'disponivel')
  const exemplaresEmprestados = exemplares.filter((e) => e.ativo && e.status == 'emprestado')
  const categoriasAtivo = categorias.filter((e) => e.ativo)
  const livrosAtivo = livros.filter((e) => e.ativo)
  const exemplaresAtivo = exemplares.filter((e) => e.ativo)
  const autoresAtivos = autores.filter((e) => e.ativo)

  const enviarFormulario = async (dadosFormulario) => {
    try {
      setError('')
      setMsg('')

      let result;
      if (modal.mode == 'att') {
        result = await api.put(`/${tab}/${modal.register.id}`, dadosFormulario)
      }else {
        result = await api.post(`/${tab}`, dadosFormulario)
      }

      setMsg(result.data.message)

      const settersPorTab = {
        usuarios: setUsuarios,
        autores: setAutores,
        categorias: setCategorias,
        livros: setLivros,
        exemplares: setExemplares,
        emprestimos: setEmprestimos,
        devolucoes: setDevolucoes
      }

      const setEntidade = settersPorTab[tab]
      const entidadeSalva = result.data.result

      if (modal.mode == 'att') {
        setEntidade((entidades) => entidades.map((e) => e.id == entidadeSalva.id ? entidadeSalva : e))
      } else {
        setEntidade((entidades => [...entidades, entidadeSalva]))
      }

      setModal({open: false, mode: 'add', register: null})

      buscarAPI()

    } catch (error) {
        const message = error.response?.data?.error || error.response?.data?.message
    
        setError(message)
      
    }
  }

  const alterarAtivo = async (id) => {
    try {
      setError('')
      setMsg('')

      const result = await api.patch(`/${tab}/${id}`)

      setMsg(result.data.message)

      const settersPorTab = {
        usuarios: setUsuarios,
        autores: setAutores,
        categorias: setCategorias,
        livros: setLivros,
        exemplares: setExemplares,
        emprestimos: setEmprestimos,
        devolucoes: setDevolucoes
      }

      const setEntidade = settersPorTab[tab]
      const entidadeSalva = result.data.result

      setEntidade((entidades) => entidades.map((e) => e.id == entidadeSalva.id ? entidadeSalva : e))

      buscarAPI()
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message
    
      setError(message)
    }
  }

  const deletar = async (id) => {
    try {
      setError('')
      setMsg('')

      const result = await api.delete(`/${tab}/${id}`)

      setMsg(result.data.message)

      const settersPorTab = {
        usuarios: setUsuarios,
        livros: setLivros
      }

      const setEntidade = settersPorTab[tab]
      const entidadeDeletada = result.data.result

      setEntidade((entidades) => entidades.filter((e) => e.id != entidadeDeletada.id))

      buscarAPI()
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message
    
      setError(message)
    }
  }

  let conteudo;
  let formulario;
  let filtros;

  switch (tab) {
    case 'usuarios':
      formulario = (
        <>
          <div className="label-input">
            <label htmlFor="nome">Nome</label>
            <input defaultValue={modal.register?.nome || ''} type="text" required id='nome' name='nome' placeholder='Digite o nome do usuario' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="cpf">Cpf</label>
            <input defaultValue={modal.register?.cpf || ''} type="text" required id='cpf' name='cpf' placeholder='Digite o cpf do usuario' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="email">Email</label>
            <input defaultValue={modal.register?.email || ''} type="email" required id='email' name='email' placeholder='Digite o email do usuario' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="senha">Senha</label>
            <input type="password" id='senha' name='senha' placeholder='Digite a senha do usuario' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="telefone">Telefone</label>
            <input defaultValue={modal.register?.telefone || ''} type="text" required id='telefone' name='telefone' placeholder='Digite o telefone do usuario' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="data_nascimento">Data Nascimento</label>
            <input defaultValue={dataConvertida(modal.register?.data_nascimento, 'modal') || ''} type="date" required id='data_nascimento' name='data_nascimento' placeholder='Digite a data de nascimento do usuario' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="endereco">Endereço</label>
            <input defaultValue={modal.register?.endereco || ''} type="text" required id='endereco' name='endereco' placeholder='Digite o endereco do usuario' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="categoria">Perfil</label>
            <select required defaultValue={modal.register?.perfil || ''} name="perfil" id="perfil">
              <option value="" disabled>Selecione uma opção</option>
              <option value="admin" >Admin</option>
              <option value="atendente" >Atendente</option>
              <option value="cliente" >Cliente</option>
            </select>
          </div>
        </>
      )
      conteudo = usuarios.map((e) => 
        <article className="card-content">
          <div className="box-text">
            <span>{e.nome}</span>
            <div>
              <p>{e.perfil}</p>
              <p>• {e.email}</p>
              <p>• {e.ativo? '🟢 Ativo' : '🔴 Inativo'}</p>
            </div>
          </div>
          <div className="box-btns">
            <button disabled={!isAdmin} aria-label='editar' onClick={() => setModal({open: true, mode: 'att', register: e})}>Editar</button>
            <button disabled={!isAdmin} aria-label='arquivar' onClick={() => alterarAtivo(e.id)}>{e.ativo? 'Arquivar' : 'Desarquivar'}</button>
            <button disabled={!isAdmin} aria-label='deletar' onClick={() => deletar(e.id)}>Deletar</button>
          </div>
        </article>
      )
      break;
    case 'autores':
      formulario = (
        <>
          <div className="label-input">
            <label htmlFor="nome">Nome</label>
            <input defaultValue={modal.register?.nome || ''} type="text" required id='nome' name='nome' placeholder='Digite o nome do autor' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="nascionalidade">Nascionalidade</label>
            <input defaultValue={modal.register?.nascionalidade || ''} type="text" required id='nascionalidade' name='nascionalidade' placeholder='Digite a nascionalidade do autor' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="data_nascimento">Data Nascimento</label>
            <input defaultValue={dataConvertida(modal.register?.data_nascimento, 'modal') || ''} type="date" required id='data_nascimento' name='data_nascimento' placeholder='Digite a data de nascimento do autor' aria-label='input'/>
          </div>
        </>
      )
      conteudo = autores.map((e) => 
        <article className="card-content">
          <div className="box-text">
            <span>{e.nome}</span>
            <div>
              <p>{e.nascionalidade}</p>
              <p>• {dataConvertida(e.data_nascimento)}</p>
              <p>• {e.ativo? '🟢 Ativo' : '🔴 Inativo'}</p>
            </div>
          </div>
          <div className="box-btns">
            <button disabled={!isAdmin} aria-label='editar' onClick={() => setModal({open: true, mode: 'att', register: e})}>Editar</button>
            <button aria-label='arquivar' onClick={() => alterarAtivo(e.id)}>{e.ativo? 'Arquivar' : 'Desarquivar'}</button>
          </div>
        </article>
      )
      break;
    case 'categorias':
      formulario = (
        <>
          <div className="label-input">
            <label htmlFor="nome">Nome</label>
            <input defaultValue={modal.register?.nome || ''} type="text" required id='nome' name='nome' placeholder='Digite o nome da categoria' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="descricao">Descricao</label>
            <textarea defaultValue={modal.register?.descricao || ''} type="text" required id='descricao' name='descricao' placeholder='Digite a descricao da categoria' aria-label='input'/>
          </div>
        </>
      )
      conteudo = categorias.map((e) => 
        <article className="card-content">
          <div className="box-text">
            <span>{e.nome}</span>
            <div>
              <p className='descricao'>{e.descricao}</p>
              <p>• {e.ativo? '🟢 Ativo' : '🔴 Inativo'}</p>
            </div>
          </div>
          <div className="box-btns">
            <button disabled={!isAdmin} aria-label='editar' onClick={() => setModal({open: true, mode: 'att', register: e})}>Editar</button>
            <button aria-label='arquivar' onClick={() => alterarAtivo(e.id)}>{e.ativo? 'Arquivar' : 'Desarquivar'}</button>
          </div>
        </article>
      )
      break;
    case 'livros':
      formulario = (
        <>
          <div className="label-input">
            <label htmlFor="isbn">Isbn</label>
            <input defaultValue={modal.register?.livro.isbn || ''} type="text" required id='isbn' name='isbn' placeholder='Digite o isbn do livro' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="titulo">Titulo</label>
            <input defaultValue={modal.register?.livro.titulo || ''} type="text" required id='titulo' name='titulo' placeholder='Digite o titulo do livro' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="ano_publicacao">Ano publicação</label>
            <input defaultValue={modal.register?.livro.ano_publicacao || ''} type="number" required id='ano_publicacao' name='ano_publicacao' placeholder='Digite o ano de publicação do livro' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="edicao">Edição</label>
            <input defaultValue={modal.register?.livro.edicao || ''} type="text" required id='edicao' name='edicao' placeholder='Digite o edicao do livro' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="editora">Editora</label>
            <input defaultValue={modal.register?.livro.editora || ''} type="text" required id='editora' name='editora' placeholder='Digite o editora do livro' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="categoria_id">Categoria</label>
            <select required defaultValue={modal.register?.livro.categoria_id || ''} name="categoria_id" id="categoria_id">
              <option value="" disabled>Selecione uma opção</option>
              {categoriasAtivo.map((e) => 
                <option key={e.id} value={e.id}>{e.nome}</option>
              )}
            </select>
          </div>
          <div className="label-input">
            <label htmlFor="descricao">Descrição</label>
            <textarea defaultValue={modal.register?.livro.descricao || ''} type="text" required id='descricao' name='descricao' placeholder='Digite o descricao do livro' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="autor_id">Autor</label>
            <select required defaultValue={modal.register?.autor_id || ''} name="autor_id" id="autor_id">
              <option value="" disabled>Selecione uma opção</option>
              {autoresAtivos.map((e) => 
                <option key={e.id} value={e.id}>{e.nome}</option>
              )}
            </select>
          </div>
        </>
      )
      conteudo = livros.map((e) => 
        <article className="card-content">
          <div className="box-text">
            <span>{e.livro.titulo}</span>
            <div>
              <p>{e.livro.isbn}</p>
              <p className='descricao'> • {e.livro.descricao}</p>
              <p>• {e.ativo? '🟢 Ativo' : '🔴 Inativo'}</p>
            </div>
          </div>
          <div className="box-btns">
            <button disabled={!isAdmin} aria-label='editar' onClick={() => setModal({open: true, mode: 'att', register: e})}>Editar</button>
            <button disabled={!isAdmin} aria-label='arquivar' onClick={() => alterarAtivo(e.id)}>{e.ativo? 'Arquivar' : 'Desarquivar'}</button>
            <button disabled={!isAdmin} aria-label='deletar' onClick={() => deletar(e.id)}>Deletar</button>
          </div>
        </article>
      )
      break;
    case 'exemplares':
      formulario = (
        <>
          <div className="label-input">
            <label htmlFor="cod_identificacao">Identificação</label>
            <input defaultValue={modal.register?.cod_identificacao || ''} type="text" required id='cod_identificacao' name='cod_identificacao' placeholder='Digite a identificação do exemplar' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="livro_id">Livro</label>
            <select required defaultValue={modal.register?.livro_id || ''} name="livro_id" id="livro_id">
              <option value="" disabled>Selecione uma opção</option>
              {livrosAtivo.map((e) => 
                <option key={e.livro.id} value={e.livro.id}>{e.livro.titulo}</option>
              )}
            </select>
          </div>
          <div className="label-input">
            <label htmlFor="data_aquisicao">Data aquisição</label>
            <input defaultValue={dataConvertida(modal.register?.data_aquisicao, 'modal') || ''} type="date" required id='data_aquisicao' name='data_aquisicao' placeholder='Digite a data de aquisição do exemplar' aria-label='input'/>
          </div>
          <div className="label-input">
            <label htmlFor="estado_conservacao">Estado conservação</label>
            <input defaultValue={modal.register?.estado_conservacao || ''} type="text" required id='estado_conservacao' name='estado_conservacao' placeholder='Digite o estado de conservação do exemplar' aria-label='input'/>
          </div>
        </>
      )
      conteudo = exemplares.map((e) => 
        <article className="card-content">
          <div className="box-text">
            <span>{e.livro.titulo}</span>
            <div>
              <p>{e.cod_identificacao}</p>
              <p>• {e.status}</p>
              <p>• {e.ativo? '🟢 Ativo' : '🔴 Inativo'}</p>
            </div>
          </div>
          <div className="box-btns">
            <button disabled={!isAdmin} aria-label='editar' onClick={() => setModal({open: true, mode: 'att', register: e})}>Editar</button>
            <button disabled={!isAdmin} aria-label='arquivar' onClick={() => alterarAtivo(e.id)}>{e.ativo? 'Arquivar' : 'Desarquivar'}</button>
          </div>
        </article>
      )
      break;
    case 'emprestimos':
      conteudo = emprestimos.map((e) => 
        <article className="card-content">
          <div className="box-text">
            <span>{e.exemplar.livro.titulo}</span>
            <div>
              <p>{e.exemplar.cod_identificacao}</p>
              <p>• {e.emprestimo.status}</p>
            </div>
          </div>

        </article>
      )
      break;
    case 'devolucoes':
      conteudo = devolucoes.map((e) => 
        <article className="card-content">
          <div className="box-text">
            <span>{e.emprestimo.emprestimo_exemplar[0].exemplar.livro.titulo}</span>
            <div>
              <p>{e.emprestimo.emprestimo_exemplar[0].exemplar.cod_identificacao}</p>
              <p>• {dataConvertida(e.data_devolucao)}</p>
            </div>
          </div>

        </article>
      )
      break;
  
    default:
      <p>Nenhum dado encontrado</p>
      break;
  }

  return (
    <main id="home">
      <section className='title'>
        <div className='logo'>
          <div>
            <img src={logo} alt="logo" />
          </div>
          <div className='box-text'>
            <h1>Painel Administrativo</h1>
            <p>Gerencie todos os recursos do sistema</p>
          </div>
        </div>
        <button aria-label='sair' onClick={logout}>Sair</button>
      </section>

      <section className='cards'>
        <article className="card">
          <div className="box-text">
            <p>Total de titulos</p>
            <p>{livrosAtivo.length}</p>
          </div>
          <div className='icone'>
            <i className="fa-solid fa-book"></i>
          </div>
        </article>
        <article className="card">
          <div className="box-text">
            <p>Total de exemplares</p>
            <p>{exemplaresAtivo.length}</p>
          </div>
          <div className='icone'>
            <i className="fa-solid fa-book-open"></i>
          </div>
        </article>
        <article className="card">
          <div className="box-text">
            <p>Exemplares disponiveis</p>
            <p>{exemplaresDisponiveis.length}</p>
          </div>
          <div className='icone'>
            <i className="fa-solid fa-check"></i>
          </div>
        </article>
        <article className="card">
          <div className="box-text">
            <p>Exemplares emprestados</p>
            <p>{exemplaresEmprestados.length}</p>
          </div>
          <div className='icone'>
            <i className="fa-solid fa-hand-holding"></i>
          </div>
        </article>
      </section>

      <section className='tabs-content'>
        <div className="tabs">
          <button className={tab == 'usuarios' ? 'tab active' : 'tab'} onClick={() => setTab('usuarios')}>Usuarios</button>
          <button disabled={!isAdmin} className={tab == 'autores' ? 'tab active' : 'tab'} onClick={() => setTab('autores')}>Autores</button>
          <button disabled={!isAdmin} className={tab == 'categorias' ? 'tab active' : 'tab'} onClick={() => setTab('categorias')}>Categorias</button>
          <button className={tab == 'livros' ? 'tab active' : 'tab'} onClick={() => setTab('livros')}>Livros</button>
          <button className={tab == 'exemplares' ? 'tab active' : 'tab'} onClick={() => setTab('exemplares')}>Exemplares</button>
          <button className={tab == 'emprestimos' ? 'tab active' : 'tab'} onClick={() => setTab('emprestimos')}>Emprestimos</button>
          <button className={tab == 'devolucoes' ? 'tab active' : 'tab'} onClick={() => setTab('devolucoes')}>Devoluções</button>
        </div>
      </section>


      <section className='box-content'>
        <div className="box-text">
          <h2>Gerenciar {tab}</h2>
          <button aria-label='adicionar' disabled={!isAdmin && tab != 'emprestimos' && tab != 'devolucoes'} onClick={() => setModal({open:true, mode: 'add', register: null})}>Adicionar</button>
        </div>
        <div className="filtros">
          {filtros}
        </div>
      </section>

      <section className='cards-content'>
        {conteudo}
      </section>
      {error? <Toast tipo='error' message={error}/> : null}
      {msg? <Toast tipo='message' message={msg}/> : null}
      {modal.open? <Modal onClose={() => setModal({open: false, mode: 'add', register: null})} onSubmit={enviarFormulario} titulo={modal.mode == 'att' ? `Editar ${tab}` : `Adicionar ${tab}`} formulario={formulario}/> : null}
    </main>
  )
}

export default Home
