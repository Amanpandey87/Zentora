import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import Swal from 'sweetalert2'
const UserPlans = () => {
  const [data, setData] = useState([])
  async function fetchData() {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:9000/admin-get-plans', {
      headers: { Authorization: `Bearer ${token}` },
    })
    setData(res?.data?.result)
  }
  useEffect(() => {
    void Promise.resolve().then(fetchData)
  }, [])
  const handlePurchasePlan = async (item) => {
    const info = JSON.parse(localStorage.getItem('info'));
    const userId = info?._id;
    const planId = item?._id;
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const orderResponse = await axios.post('http://localhost:9000/user-create-payment-order', { planId }, { headers });
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
      const order = orderResponse.data.result;
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Zentora',
        description: `${item.name} plan`,
        order_id: order.id,
        handler: async (payment) => {
          const response = await axios.post('http://localhost:9000/user-verify-payment', { ...payment, userId, planId }, { headers });
          await Swal.fire('Payment', response.data.message, 'success');
        },
        prefill: { email: info?.email, contact: info?.phone },
        theme: { color: '#0d9488' },
      });
      checkout.open();
    } catch (error) {
      Swal.fire('Payment', error.response?.data?.message || 'Unable to start payment', 'error');
    }
  }

  return (
    <section className="pricing-section section-pad">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-header text-center">
              <p className="eyebrow">MY PLAN &amp; CREDITS</p>
              <h2 className="section-title">
                My Plan &amp; Bidding <span className="underline-word">Credits</span>
              </h2>
              <p className="section-sub">
                Purchase a plan to get monthly credits. Each bid on a project costs <strong>1 credit</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <div className="dash-plan-banner text-center mb-0">
              <strong>Current Plan:</strong> Pro · 42 / 50 credits left
            </div>
          </div>
        </div>

        <div className="row g-4 justify-content-center">
          {data?.map((item) => {
            return (<div key={item?._id} className="col-12 col-sm-6 col-lg-4">
              <div className="pricing-card popular h-100">
                {item?.popular && <span className="popular-badge">Most Popular</span>}

                <div className="pricing-card-top">
                  <h4>{item?.name}</h4>
                  <p className="plan-price">
                    ₹{item?.price} <span>/ month</span>
                  </p>
                  <p className="plan-desc">{item?.tagline}</p>
                  <ul className="plan-features list-unstyled">
                    <li className="on">
                      <FaCheck className="feat-icon" />
                      <span>{item?.credits} bidding credits / month</span>
                    </li>
                    <li className="on">
                      <FaCheck className="feat-icon" />
                      <span>Browse all open projects</span>
                    </li>
                    <li className="on">
                      <FaCheck className="feat-icon" />
                      <span>Enhanced portfolio profile</span>
                    </li>
                    <li className="on">
                      <FaCheck className="feat-icon" />
                      <span>Priority bid visibility</span>
                    </li>
                    <li className="off">
                      <FaTimes className="feat-icon" />
                      <span>Bid analytics dashboard</span>
                    </li>
                  </ul>
                </div>
                <div className="pricing-card-bottom">
                  <button onClick={() => handlePurchasePlan(item)} type="button" className="plan-btn plan-btn-solid">
                    Get Plan
                  </button>
                  <p className="plan-footer">50 credits included · 1 credit per bid</p>
                </div>
              </div>
            </div>)
          })}

          {/* PRO */}



        </div>
      </div>
    </section>
  )
}

export default UserPlans