import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import {Link} from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-20">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-10">

        <div>
          <h2 className="text-3xl font-bold text-green-500">
            EasyMart
          </h2>

          <p className="mt-5 text-gray-400 leading-7">
            Fresh organic groceries delivered
            directly to your doorstep.
          </p>

          <div className="flex gap-4 mt-6">

            <FaFacebookF className="cursor-pointer hover:text-green-500 duration-300" />

            <FaInstagram className="cursor-pointer hover:text-green-500 duration-300" />

            <FaTwitter className="cursor-pointer hover:text-green-500 duration-300" />

            <FaLinkedin className="cursor-pointer hover:text-green-500 duration-300" />

          </div>

        </div>

        <div>
          <h3 className="font-bold text-xl mb-5">
            Quick Links
          </h3>

          <ul className="space-y-3 text-gray-400">
            <li className="cursor-pointer hover:text-green-500 duration-300"><Link to="/">Home</Link></li>
            <li className="cursor-pointer hover:text-green-500 duration-300"><Link to="/shop">Shop</Link></li>
            <li className="cursor-pointer hover:text-green-500 duration-300"><Link to="/cart">Categories</Link></li>
            <li className="cursor-pointer hover:text-green-500 duration-300"><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-5">
            Categories
          </h3>

          <ul className="space-y-3 text-gray-400">
            <li className="cursor-pointer hover:text-green-500 duration-300">Vegetables</li>
            <li className="cursor-pointer hover:text-green-500 duration-300">Fruits</li>
            <li className="cursor-pointer hover:text-green-500 duration-300">Fish</li>
            <li className="cursor-pointer hover:text-green-500 duration-300">Bakery</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-5">
            Contact
          </h3>

          <ul className="space-y-3 text-gray-400">
            <li className="cursor-pointer hover:text-green-500 duration-300">Karachi, Pakistan</li>
            <li className="cursor-pointer hover:text-green-500 duration-300">+92 300 1234567</li>
            <li className="cursor-pointer hover:text-green-500 duration-300">support@easymart.com</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-800 mt-16 py-6 text-center text-gray-500 cursor-pointer hover:text-green-500 duration-300">
        © 2026 EasyMart. All Rights Reserved.
      </div>

    </footer>
  );
}

export default Footer;