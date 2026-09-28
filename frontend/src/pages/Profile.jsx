import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaSignOutAlt } from "react-icons/fa";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/home/Footer";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    await updateProfile(form);
    setSaving(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const inputClass = "w-full border rounded-xl p-3";

  return (
    <>
      <Navbar />

      <section className="bg-gray-100 min-h-screen py-32">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex flex-col items-center">
              <FaUserCircle className="text-8xl text-green-600" />

              <h1 className="text-4xl font-bold mt-4">My Profile</h1>

              <p className="text-gray-500 mt-2 flex items-center gap-2">
                <FaEnvelope /> {user?.email}
              </p>
            </div>

            <form onSubmit={handleSave} className="mt-10 space-y-5">
              <div>
                <label className="text-gray-500 text-sm">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-gray-500 text-sm">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-gray-500 text-sm">Address</label>
                <textarea
                  name="address"
                  rows="3"
                  value={form.address}
                  onChange={handleChange}
                  className={inputClass}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-xl"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>

            <Link
              to="/orders"
              className="block text-center mt-4 border border-green-600 text-green-600 py-3 rounded-xl hover:bg-green-50"
            >
              My Orders
            </Link>

            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl flex justify-center items-center gap-3"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Profile;
