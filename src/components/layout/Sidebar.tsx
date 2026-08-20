import { NavLink } from 'react-router-dom'
import "./Sidebar.css"

function Sidebar() {
  return (
    <aside className="app-sidebar">
      <nav aria-label="Primary navigation">
        <NavLink to="/dashboard"><span>⌁</span>Dashboard</NavLink>
        <NavLink to="/tests/create"><span>⌑</span>Test Creation</NavLink>
        <NavLink to="/dashboard"><span>▧</span>Test Tracking</NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
