export default function ContactSection() {
  return (
    <section id="contact" className="container py-5 mb-5">
      <div className="section-title text-center mb-5">
        <h2>Contact Me</h2>
        <p>Let&apos;s work together</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="glass-card p-5">
            <div className="row g-4">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control custom-input"
                  placeholder="Your Name"
                />
              </div>

              <div className="col-md-6">
                <input
                  type="email"
                  className="form-control custom-input"
                  placeholder="Your Email"
                />
              </div>

              <div className="col-12">
                <textarea
                  rows={5}
                  className="form-control custom-input"
                  placeholder="Your Message"
                ></textarea>
              </div>

              <div className="col-12 text-center">
                <button className="btn btn-info btn-lg rounded-pill px-5">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
