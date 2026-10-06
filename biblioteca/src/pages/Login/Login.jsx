import './login.css'
import logo from '../../assets/logo-bg.png'
import { useState } from 'react'
import {useAuth} from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Toast from '../../components/Toast/Toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')

  const {login} = useAuth()
  const navigate = useNavigate()

  const fazerLogin = async (e) => {
    e.preventDefault()
    try {
      setError('')

      await login(email,senha)

      navigate('/')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <main id="login">
      <section className='box-info'>
        <div>
          <img src={logo} alt="Logo" />
        </div>
        <p>Acesso autorizado somente a funcionarios</p>
      </section>
      <section className="box-form">
        <h2>Fazer Login</h2>
        <p>Insira seus dados para acessar a plataforma</p>
        <form onSubmit={fazerLogin}>
          <div className="label-input">
            <label htmlFor="email">Email</label>
            <input onChange={(e) => setEmail(e.target.value)} type="email" id='email' name='email' required aria-label='Email' placeholder='Insira seu email'/>
          </div>
          <div className="label-input">
            <label htmlFor="senha">Senha</label>
            <input onChange={(e) => setSenha(e.target.value)} type="password" id='senha' name='senha' required aria-label='Email' placeholder='Insira sua senha'/>
          </div>

          <button aria-label='login' type='submit'>Fazer Login</button>
        </form>
      </section>
      {error? <Toast tipo='error' message={error}/> : null}
    </main>
  )
}

export default Login
