import useMethodNav from "@/app/functions/UseNav";

export default function Navbar() {
  const { active, handleClick } = useMethodNav();

  return (
    <nav className="navbar pt-3 sticky-top">
      <div className="container justify-content-center">
        <div className="rounded-pill shadow-sm px-2 px-md-4 py-1 py-md-2 nav-capsule">
          <ul className="d-flex flex-row align-items-center gap-1 gap-md-3 fw-semibold mb-0 p-0 list-unstyled">
            <li className="nav-item">
              <a
                className={`nav-link ${active === "home" ? "active" : ""}`}
                onClick={() => handleClick("home")}
              >
                <i className="bi bi-house"></i>
                <span> Home</span>
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link ${active === "about" ? "active" : ""}`}
                onClick={() => handleClick("about")}
              >
                <i className="bi bi-person"></i>
                <span> About</span>
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link ${active === "skills" ? "active" : ""}`}
                onClick={() => handleClick("skills")}
              >
                <i className="bi bi-code-slash"></i>
                <span> Skills</span>
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link ${active === "projects" ? "active" : ""}`}
                onClick={() => handleClick("projects")}
              >
                <i className="bi bi-briefcase"></i>
                <span> Projects</span>
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link ${active === "contact" ? "active" : ""}`}
                onClick={() => handleClick("contact")}
              >
                <i className="bi bi-envelope"></i>
                <span> Contact</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}