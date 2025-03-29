import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../atoms/authModalAtom';

export default function Navbar() {
  const setAuthModalState = useSetRecoilState(authModalState);
  const navigate = useNavigate();
  
  const handleClick = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: true }));
  };

  const handlelearn = () => {
    navigate(`/learn`)
  }

  return (
    <div className="flex items-center justify-between py-4">
      <Link to="/" className="flex items-center">
        <img src="/logo.png" alt="CodeCraft" className="h-12 w-auto" />
      </Link>
      <div className="flex items-center space-x-4">
        <button
          className="px-6 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          onClick={() => navigate('/problems')}
        >
          Problems
        </button>
        <button
          className="px-6 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          onClick={handlelearn}
        >
          Learn
        </button>
        <button
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          onClick={handleClick}
        >
          Sign In
        </button>
      </div>
    </div>
  )
}
