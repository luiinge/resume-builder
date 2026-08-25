import { NavLink, Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Resume Builder</h1>
        <nav className="app-nav">
          <NavLink to="/profiles" className={({ isActive }) => (isActive ? 'active' : '')}>
            Profiles
          </NavLink>
          <NavLink to="/templates" className={({ isActive }) => (isActive ? 'active' : '')}>
            Templates
          </NavLink>
          <NavLink to="/generate" className={({ isActive }) => (isActive ? 'active' : '')}>
            Generate CV
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
