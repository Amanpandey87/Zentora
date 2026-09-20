
const ContactUs = () => {
  return (
    <div className='row py-3 contact'>
      <div className='col-sm-10 mx-auto'>
        <div className='webheading'>Contact <b className='text-color1'>Us</b></div>
        <hr className='w-25 mx-auto text-color1' />

        <div className='row justify-content-center'>
          <div className='col-lg-8'>
            <div className='contact-panel'>
              <div className='contact-box'>
                <div className='contact-label'>Get in Touch</div>
                <a href='mailto:pandeyaman5283@gmail.com' className='contact-link'>pandeyaman5283@gmail.com</a>
                <a href='mailto:pandeyaman5283@gmail.com' className='contact-btn'>Get in Touch</a>
              </div>

              <div className='contact-divider'>
                <span className='contactor'>Or</span>
              </div>

              <div className='contact-box contact-box-right'>
                <div className='contact-label'>Message us on WhatsApp</div>
                <a href='https://wa.me/919082115064' target='_blank' rel='noreferrer' className='contact-link'>
                  +91 9082115064
                </a>
                <a href='https://wa.me/919082115064' target='_blank' rel='noreferrer' className='contact-btn'>
                  Open WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs