export default function ProjectsSection() {
  return (
    <section id="projects" className="container py-5 scroll-margin-top">
      <div className="section-title text-center mb-5">
        <h2>Projects</h2>
        <p>Some of my recent work</p>
      </div>

      <div className="row g-4">
        {[1, 2, 3].map((item) => (
          <div className="col-md-4" key={item}>
            <div className="project-card">
              <img
                src={`https://picsum.photos/500/300?random=${item}`}
                className="img-fluid"
                alt=""
              />

              <div className="p-4">
                <h4>E-Commerce Website</h4>

                <p>
                  Modern responsive e-commerce platform with elegant UI and
                  powerful backend.
                </p>

                <button className="btn btn-info rounded-pill">
                  View Project
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
