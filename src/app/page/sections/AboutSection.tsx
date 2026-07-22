export default function AboutSection() {
  return (
    <section id="about" className="container py-5">
      <div className="section-title text-center mb-5">
        <h2>About Me</h2>
        <p>Get to know more about me</p>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="glass-card p-4 h-100">
            <h3 className="mb-3">
              <i className="bi bi-person-circle"></i> Who Am I?
            </h3>

            <p>
              I am a passionate web developer who loves creating elegant and
              interactive websites. I enjoy building modern applications using
              React, Next.js, Bootstrap and Laravel.
            </p>

            <p>
              My goal is to build impactful digital experiences with clean code
              and modern design.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="glass-card p-4 h-100">
            <h3 className="mb-3">
              <i className="bi bi-award"></i> Experience
            </h3>

            <div className="timeline-item">
              <h5>Frontend Developer</h5>
              <small>2023 - Present</small>
            </div>

            <div className="timeline-item mt-4">
              <h5>UI/UX Designer</h5>
              <small>2022 - 2023</small>
            </div>

            <div className="timeline-item mt-4">
              <h5>Freelance Web Developer</h5>
              <small>2021 - Present</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
