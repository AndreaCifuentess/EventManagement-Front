import {
  FaInstagram,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 px-6 md:px-12 font-sans rounded-lg">

      {/* Footer Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10  text-sm text-white">
        <div>
          <h4 className="font-bold text-left mb-3">Sign up for our newsletter</h4>
          <p className="text-left text-white/70 mb-4">
            Don’t worry, we reserve our newsletter for important news so we only send a few updates a year.
          </p>
          <button onClick={() => alert("Feature coming soon")} className="border block ml-0 border-white rounded-full px-4 py-1 hover:bg-white hover:text-black transition">
            Subscribe
          </button>
        </div>

        <div>
          <h4 className="font-bold text-left mb-3">Quick Links</h4>
          <ul className="space-y-2 text-left text-white/70">
            <li><a href="/">Home</a></li>
            <li><a href="categories">Categories</a></li>
            <li><a href="services">Services</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-left mb-3">Company</h4>
          <ul className="space-y-2 text-left text-white/70">
            <li><a href="contact">Contact</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-left mb-3">Stay Connected</h4>
          <ul className="space-y-2 text-left text-white/70">
            <li><a href="#">Instagram</a></li>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="https://github.com/newdevatgit/event-management-ui">Git Hub</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-white/20 pt-4 pb-4 flex flex-col md:flex-row justify-between items-center text-xs text-white/70">
        <p>© 2025 EVENTIFY. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0 text-lg">
          <a href="https://github.com/newdevatgit/event-management-ui"><FaGithub /></a>
          <a href="#"><FaLinkedin /></a>
          <a href="#"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
}
