import OrbitIcon from "@/app/components/OrbitIcon";

export default function HomeSection() {
  return (
    <section id="home" className="hero-section">
      {/* Background decorative elements */}
      <div className="hero-bg-glow"></div>

      {/* Floating hexagons */}
      <div className="hex hex1">
        <img src="/element/hex.png" alt="hexagon" />
      </div>
      <div className="hex hex2">
        <img src="/element/hex.png" alt="hexagon" />
      </div>
      <div className="hex hex3">
        <img src="/element/hex.png" alt="hexagon" />
      </div>
      <div className="hex hex4">
        <img src="/element/hex.png" alt="hexagon" />
      </div>

      <img src="/element/polcadot.png" className="poldacot-img" alt="polcadot" />
      
      <div className="container">
        <div className="row align-items-center min-vh-100">
          {/* LEFT CONTENT */}
          <div className="col-lg-6 hero-left">
            <span className="badge bg-primary-color px-3 py-2 rounded-pill">
              Available For Freelance
            </span>
            <h1 className="hero-title mt-4">
              Hi, I'm <span>M Khairul Unsa</span>
            </h1>
            <h2 className="hero-subtitle">Fullstack Web Developer</h2>
            <p className="hero-text mt-4">
              I build modern, responsive and user-friendly websites with
              beautiful UI/UX experiences. Passionate about creating digital
              products that are fast, elegant and interactive.
            </p>
            <div className="mt-4 d-flex gap-3 flex-wrap">
              <button className="btn btn-info btn-lg rounded-pill px-4">
                <i className="bi bi-send"></i> Hire Me
              </button>
              <button className="btn btn-outline-dark btn-lg rounded-pill px-4 ">
                <i className="bi bi-download"></i> Download CV
              </button>
            </div>
            <div className="social-icons mt-3">
              <i className="bi bi-github"></i>
              <i className="bi bi-linkedin"></i>
              <i className="bi bi-instagram"></i>
              <i className="bi bi-discord"></i>
            </div>
          </div>

          {/* RIGHT CONTENT: 3D Character + Orbiting Icons */}
          <div className="col-lg-6">
            <div className="hero-right">
              {/* Orbit rings */}
              <div className="orbit-ring"></div>
              <div className="orbit-ring orbit-ring-2"></div>

              {/* Character */}
              <img src="/pro.png" alt="profile" className="hero-img" />

              {/* 3D Icons with orbit animation */}
              <OrbitIcon
                image="/element/laravel.png"
                size={110}
                radiusX={255}
                radiusY={250}
                startAngle={288}
                speed={0.25}
                glow="#ff2d20"
                initialDelay={2100}
              />
              <OrbitIcon
                image="/element/react.png"
                size={110}
                radiusX={270}
                radiusY={260}
                startAngle={0}
                speed={0.25}
                glow="#61dafb"
                initialDelay={1650}
              />
              <OrbitIcon
                image="/element/js.png"
                size={110}
                radiusX={250}
                radiusY={250}
                startAngle={72}
                speed={0.25}
                glow="#f7df1e"
                initialDelay={1200}
              />
              <OrbitIcon
                image="/element/css.png"
                size={110}
                radiusX={260}
                radiusY={255}
                startAngle={144}
                speed={0.25}
                glow="#2965f1"
                initialDelay={800}
              />
              <OrbitIcon
                image="/element/html.png"
                size={110}
                radiusX={240}
                radiusY={245}
                startAngle={216}
                speed={0.25}
                glow="#ff5722"
                initialDelay={300}
              />

              {/* Source card */}
              <img src="/element/source_code.png" className="source-card" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
