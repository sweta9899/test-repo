import "./Header.css"

function Header() {
  return (
    <header className="app-header">
      <div className="app-brand"><span>Prep</span>route</div>
      <div className="header-assignment">Preproute Assignment <span>⌄</span></div>
      <div className="header-user"><span className="notification">♧</span><span className="avatar">A</span><span><strong>Alex Wando</strong><small>Admin</small></span><span>⌄</span></div>
    </header>
  )
}

export default Header
