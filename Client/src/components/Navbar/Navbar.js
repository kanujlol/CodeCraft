import React from 'react'
import { Link } from 'react-router-dom'
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../atoms/authModalAtom';


export default function Navbar() {
  const setAuthModalState = useSetRecoilState(authModalState);
  const handleClick = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: true }));
  };
  return (
    <div className="flex items-center justify-between sm:px-12 px-2 md:px-24">
      <Link to="/" className="flex items-center justify-center h-20">
        
      </Link>
      
      <div className="flex items-center space-x-5" >
        <button
          className="bg-brand-purple text-white px-2 py-1 sm:px-2 rounded-md text-sm font-medium border-2 border-transparent
            hover:text-brand-purple hover:bg-white hover:border-2 hover:border-brand-purple
            transition duration-300 ease-in-out"
        >
          Premium
        </button>
        <button
          className="bg-brand-purple text-white px-2 py-1 sm:px-2 rounded-md text-sm font-medium border-2 border-transparent
            hover:text-brand-purple hover:bg-white hover:border-2 hover:border-brand-purple
            transition duration-300 ease-in-out"
            onClick={handleClick}
        >
          Sign In
        </button>
      </div>
    </div>
  )
}
