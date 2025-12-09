
import React, { useState } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { FaLocationDot } from 'react-icons/fa6';
import { FaPhone } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { IoMdChatbubbles } from 'react-icons/io';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        timestamp: new Date()
      });
      toast.success('Message sent successfully!');
      alert('Message sent successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      });
    } catch (error) {
      toast.error('Error sending message');
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div data-aos="fade-right">
      <section className="bg-white">
        <div className="container px-6 py-12 mx-auto">
          <div className="text-center">
            <p className="text-2xl font-semibold font-satisfy md:text-2xl text-black">Contact us</p>
            <h1 className="mt-2 text-2xl font-semibold text-gray-800 md:text-3xl lg:text-4xl">
              Chat to our friendly team
            </h1>
            <p className="mt-3 text-gray-500">
              We’d love to hear from you. Please fill out this form or shoot us
              an email.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 mt-10 lg:grid-cols-2">
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 gap-12 md:gap-8 md:grid-cols-2">
              {/* Email Card */}
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-10 px-2">
                <span className="inline-block p-3 text-black rounded-full bg-gray-200">
                  <MdEmail/>
                </span>
                <h2 className="mt-4 text-base font-medium text-gray-800">Email</h2>
                <p className="mt-2 text-sm text-gray-500">Our friendly team is here to help.</p>
                <p className="mt-2 text-sm text-blue-500">contact@eventique.com</p>
              </div>

              {/* Location Card */}
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-10 px-2">
                <span className="inline-block p-3 text-black rounded-full bg-gray-200"><FaLocationDot/></span>
                <h2 className="mt-4 text-base font-medium text-gray-800">Office</h2>
                <p className="mt-2 text-sm text-gray-500">Come say hello at our office HQ.</p>
                <p className="mt-2 text-sm text-blue-500">Tuluá, Valle del Cauca, Colombia</p>
              </div>

              {/* Chat Card */}
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-10 px-2">
                <span className="inline-block p-3 text-black rounded-full bg-gray-200"><IoMdChatbubbles /></span>
                <h2 className="mt-4 text-base font-medium text-gray-800">Live Chat</h2>
                <p className="mt-2 text-sm text-gray-500">Our friendly team is here to help.</p>
                <p className="mt-2 text-sm text-blue-500">Start new chat</p>
              </div>

              {/* Phone Card */}
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-10 px-2">
                <span className="inline-block p-3 text-black rounded-full bg-gray-200"><FaPhone /></span>
                <h2 className="mt-4 text-base font-medium text-gray-800">Phone</h2>
                <p className="mt-2 text-sm text-gray-500">Mon–Fri from 8am to 5pm.</p>
                <p className="mt-2 text-sm text-blue-500">+57 3162561558</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-4 py-6 rounded-lg bg-gray-50 md:p-8">
              <form onSubmit={handleSubmit}>
                <div className="-mx-2 md:items-center md:flex">
                  <div className="flex-1 px-2">
                    <label className="block mb-2 text-sm text-gray-600">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      required
                    />
                  </div>

                  <div className="flex-1 px-2 mt-4 md:mt-0">
                    <label className="block mb-2 text-sm text-gray-600">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Smith"
                      className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm text-gray-600">Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    required
                  />
                </div>

                <div className="w-full mt-4">
                  <label className="block mb-2 text-sm text-gray-600">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="block w-full h-32 px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg md:h-56 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Message"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
