import React from 'react';
import emailjs from 'emailjs-com';
import './styles.css';
import './contact.css';

const SERVICE_ID = 'service_fjsim7t';
const TEMPLATE_ID = 'template_oj622gt'; // Replace this
const USER_ID = 'DMcUoaYw-z5wBf79c'; // Replace this

const Contact = () => {
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, e.target, USER_ID)
      .then((result) => {
        alert('Your message has been sent successfully!');
        e.target.reset(); // Clear form after submit
      }, (error) => {
        alert('Failed to send message. Please try again later.');
        console.error(error.text);
      });
  };

  return (
    <div className="specific-page">
      <h1>Contact Us</h1>

      <main>
        <form id="contact-form" onSubmit={sendEmail}>
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <td><input type="text" name="name" required /></td>
              </tr>
              <tr>
                <th>Email</th>
                <td><input type="email" name="email" required /></td>
              </tr>
              <tr>
                <th>Title</th>
                <td><input type="text" name="title" required /></td>
              </tr>
              <tr>
                <th>Message</th>
                <td><textarea name="message" rows="4" required /></td>
              </tr>
            </tbody>
          </table>

          <div className="anupam">
            <p>Visit us on</p>
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShSW8GGrxy-WZfbdkQjXJsG6H5_WDr2HG2XQ&s" 
              width="50" 
              height="50" 
              alt="Social media icon"
            />
          </div>

          <button type="submit">Send Message</button>
        </form>
      </main>
    </div>
  );
};

export default Contact;
