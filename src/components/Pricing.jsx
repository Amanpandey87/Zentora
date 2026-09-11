import { Link } from 'react-router-dom'
import { FaCheck, FaTimes } from 'react-icons/fa'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Everything you need to get started.',
    features: [
      ['Create a freelancer profile', true],
      ['Apply to projects', true],
      ['Priority support', false],
    ],
    buttonClass: 'plan-btn-outline',
  },
  {
    name: 'Pro',
    price: 'Rs. 999',
    description: 'Grow faster with more visibility.',
    features: [
      ['Create a freelancer profile', true],
      ['Apply to projects', true],
      ['Priority support', true],
    ],
    popular: true,
    buttonClass: 'plan-btn-solid',
  },
  {
    name: 'Elite',
    price: 'Rs. 2,499',
    description: 'Stand out with premium benefits.',
    features: [
      ['Create a freelancer profile', true],
      ['Apply to projects', true],
      ['Priority support', true],
    ],
    buttonClass: 'plan-btn-outline',
  },
]

const Pricing = () => {
  return (
    <section className="pricing-section section-pad">
      <div className="container">
        <div className="section-header text-center">
          <p className="eyebrow">FREELANCER PLANS</p>
          <h2 className="section-title">Choose the right plan for you</h2>
        </div>
        <div className="row g-4">
          {plans.map((plan) => (
            <div className="col-lg-4" key={plan.name}>
              <div className={`pricing-card h-100${plan.popular ? ' popular' : ''}`}>
                {plan.popular && <span className="popular-badge">MOST POPULAR</span>}
                <div className="pricing-card-top">
                  <h4>{plan.name}</h4>
                  <p className="plan-price">{plan.price}<span>{plan.price === 'Free' ? '' : ' / month'}</span></p>
                  <p className="plan-desc">{plan.description}</p>
                  <ul className="plan-features list-unstyled">
                    {plan.features.map(([feature, included]) => (
                      <li className={included ? 'on' : 'off'} key={feature}>
                        {included ? <FaCheck className="feat-icon" /> : <FaTimes className="feat-icon" />}
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pricing-card-bottom">
                  <Link to="/register" className={`plan-btn ${plan.buttonClass}`}>Get started</Link>
                  <p className="plan-footer">Cancel anytime</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing