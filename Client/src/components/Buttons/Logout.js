import React from 'react'
import { FiLogOut } from 'react-icons/fi'
import { supabase } from '../../supabase/supabase';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();
    const handleLogout = async () => {
      try {
        // Sign out from Supabase
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw new Error('Error signing out from Supabase');
        }
        navigate('/auth')
        // Additional cleanup or redirection logic can be added here
      } catch (error) {
        console.error('Error during logout:', error.message);
      }
    };
  return (
    <button
      className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange"
      onClick={handleLogout}
    >
      <FiLogOut />
    </button>
  )
}
