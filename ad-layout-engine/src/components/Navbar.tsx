type NavbarProps = {
  currentView: 'ads' | 'create' | 'workspace'
  onNavigate: (view: 'ads' | 'create') => void
}

function Navbar({ currentView, onNavigate }: NavbarProps) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          className="brand"
          onClick={() => onNavigate('ads')}
        >
          <span className="brand-mark">A</span>

          <span className="brand-copy">
            <strong>Adaptive</strong>
            <span>Ads Engine</span>
          </span>
        </button>

        <nav className="navbar-links">
          <button
            className={`nav-link ${
              currentView === 'ads' || currentView === 'workspace'
                ? 'active'
                : ''
            }`}
            onClick={() => onNavigate('ads')}
          >
            Ads
          </button>

          <button
            className={`nav-link ${
              currentView === 'create' ? 'active' : ''
            }`}
            onClick={() => onNavigate('create')}
          >
            Create ad
          </button>
        </nav>

        <div className="navbar-status">
          <span className="status-dot" />
          Engine ready
        </div>
      </div>
    </header>
  )
}

export default Navbar