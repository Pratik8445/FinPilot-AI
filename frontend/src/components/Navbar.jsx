import './Navbar.css';

const Navbar = ({ title, onMenuToggle }) => {
  return (
    <header className="navbar">
      <button
        className="navbar__menu-btn"
        onClick={onMenuToggle}
        aria-label="Toggle sidebar menu"
      >
        ☰
      </button>
      <h1 className="navbar__title">{title}</h1>
      <div className="navbar__right">
        <div className="navbar__status">
          <span className="navbar__status-dot" aria-hidden="true" />
          <span>API Online</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
