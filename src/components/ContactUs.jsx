
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
                <div className='contact-label'>Call us via</div>
                <a href='tel:902115063' className='contact-link'>902115063</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs