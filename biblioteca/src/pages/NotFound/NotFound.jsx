import { NavLink } from "react-router-dom"

const NotFound = () => {
  return (
    <main id='not-found'>
      <h1>404</h1>
      <p>Pagina não encontrada</p>
      <NavLink to={'/'}>Voltar para pagina inicial</NavLink>
    </main>
  )
}

export default NotFound
