import useMethodNav from "@/app/function/UseNav";

export default function Navbar() {
    
  const { active, handleClick } = useMethodNav();

  return (
    <>
      <nav className="navbar navbar-expand-lg pt-3 sticky-top">
        <div className="container justify-content-center">
          <div className="rounded-pill shadow-lg px-4 py-2 nav-capsule">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#menu"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse justify-content-center"
              id="menu"
            >
              <ul className="navbar-nav gap-3 fw-semibold">
                <li className="nav-item">
                  <a
                    className={`nav-link ${active === "home" ? "active" : ""}`}
                    onClick={() => handleClick("home")}
                  >
                    <i className="bi bi-house"></i> Home
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className={`nav-link ${active === "about" ? "active" : ""}`}
                    onClick={() => handleClick("about")}
                  >
                    <i className="bi bi-person"></i> About
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className={`nav-link ${active === "skills" ? "active" : ""}`}
                    onClick={() => handleClick("skills")}
                  >
                    <i className="bi bi-code-slash"></i> Skills
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className={`nav-link ${active === "projects" ? "active" : ""}`}
                    onClick={() => handleClick("projects")}
                  >
                    <i className="bi bi-briefcase"></i> Projects
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className={`nav-link ${active === "contact" ? "active" : ""}`}
                    onClick={() => handleClick("contact")}
                  >
                    <i className="bi bi-envelope"></i> Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
