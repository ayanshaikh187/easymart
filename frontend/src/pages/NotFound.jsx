import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">

      <h1 className="text-9xl font-extrabold text-green-600">
        404
      </h1>

      <h2 className="text-4xl font-bold mt-6">
        Page Not Found
      </h2>

      <p className="text-gray-500 mt-4 text-center max-w-lg">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full duration-300"
      >
        Back To Home
      </Link>

    </section>
  );
}

export default NotFound;