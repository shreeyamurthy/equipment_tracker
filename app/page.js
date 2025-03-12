import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'oklch(0.869 0.022 252.894)' }}>
      <div className=" p-8 rounded w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to </h1>
        <h1 className="text-4xl  font-bold mb-4" style={{ color: 'oklch(0.777 0.152 181.912)' }}>EQUPMENT MAINTAINANCE TRACKER APP</h1>
        <p className="text-white-700 mb-6">What would you like to do?</p>
        <div className="flex justify-center space-x-6">
          <a href="/register" className="py-2 px-4 rounded" style={{ backgroundColor: 'oklch(0.777 0.152 181.912)', color: '#FFFFFF' }}>
            Sign Up
          </a>
          <a href="/login" className="py-2 px-4 rounded" style={{ backgroundColor: 'oklch(0.777 0.152 181.912)', color: '#FFFFFF' }}>
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
