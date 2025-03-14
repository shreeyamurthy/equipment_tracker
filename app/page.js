import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center" >
      <div className="p-8 rounded w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-black" >
          Welcome to
        </h1>
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'oklch(0.685 0.169 237.323)' }}>
          EQUIPMENT MAINTENANCE TRACKER APP
        </h1>
        <p className="text-white-700 mb-6 text-black" >
          What would you like to do?
        </p>
        <div className="flex justify-center space-x-6">
          <a
            href="/register"
            className="py-2 px-4 rounded transform transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: 'oklch(0.685 0.169 237.323)', color: '#FFFFFF' }}
          >
            Sign Up
          </a>
          <a
            href="/login"
            className="py-2 px-4 rounded transform transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: 'oklch(0.685 0.169 237.323)', color: '#FFFFFF' }}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}


// style={{ backgroundColor: 'oklch(0.869 0.022 252.894)' }}