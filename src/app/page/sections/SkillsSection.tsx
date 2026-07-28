export default function SkillsSection() {
  return (
    <section id="skills" className="skills-section py-5 scroll-margin-top">
      <div className="gradient-overlay-bottom" />
      <div className="container content-skills">
        <div className="section-title text-center mb-5">
          <h2>Skills</h2>
          <p>Technologies I use</p>
        </div>

        <div className="row g-4">
          {[
            "HTML",
            "CSS",
            "Bootstrap",
            "JavaScript",
            "React",
            "Next.js",
            "Laravel",
            "MySQL",
          ].map((skill, index) => (
            <div className="col-6 col-md-3" key={index}>
              <div className="skill-card text-center p-4">
                <i className="bi bi-code-square fs-1"></i>
                <h5 className="mt-3">{skill}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
