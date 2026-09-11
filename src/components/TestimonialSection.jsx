import { Link } from 'react-router-dom'
import { FaArrowRight, FaQuoteRight, FaStar } from 'react-icons/fa'

const TestimonialSection = () => {
  return (
    <section className="testimonial-section section-pad">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-4">
            <p className="eyebrow">TESTIMONIALS</p>
            <h2 className="section-title text-start">
              What Our Zentora{' '}
              <span className="underline-word">Community</span> Says
            </h2>
            <p className="section-sub text-start ms-0">
              Clients and freelancers worldwide trust Zentora to connect,
              collaborate, and earn — building careers and businesses without borders.
            </p>
            <Link to="/about-us" className="btn btn-orange">
              View All <FaArrowRight className="ms-2" />
            </Link>
          </div>

          <div className="col-lg-8">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="testimonial-card">
                  <div className="testi-avatar">
                    <img src="/images/testimonial-01.png" alt="David Owens" />
                    <span className="quote-badge"><FaQuoteRight /></span>
                  </div>
                  <p className="testi-text">
                    Zentora helped me land global clients and grow my freelance career
                    with secure escrow and transparent bidding.
                  </p>
                  <div className="testi-stars">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                  <h6>David Owens</h6>
                  <span className="testi-role">Designer</span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="testimonial-card">
                  <div className="testi-avatar">
                    <img src="/images/testimonial-02.png" alt="Tom Hurley" />
                    <span className="quote-badge"><FaQuoteRight /></span>
                  </div>
                  <p className="testi-text">
                    Hiring on Zentora is seamless. Quality talent, fair pricing, and
                    support that actually shows up when you need it.
                  </p>
                  <div className="testi-stars">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                  <h6>Tom Hurley</h6>
                  <span className="testi-role">Content Creator</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialSection