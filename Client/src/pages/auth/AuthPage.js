import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import AuthModal from '../../components/Modals/AuthModal';
import { useRecoilValue } from 'recoil';
import { authModalState } from '../../atoms/authModalAtom';
import { supabase } from '../../supabase/supabase';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const navigate = useNavigate();
  const authModal = useRecoilValue(authModalState);
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const getUserSession = async () => {
      // Get the current user's session
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching user session:', error.message);
        return null;
      }

      // Access user information from the session
      const currentUser = data?.session;
      console.log('User:', currentUser);

      return currentUser;
    };

    const fetchData = async () => {
      const userData = await getUserSession();
      setUser(userData);
      setPageLoading(false);

      if (userData) {
        navigate('/');
      }
    };

    fetchData();
  }, [navigate]);

  if (pageLoading) return null;

  return (
    <div className="bg-gradient-to-b from-gray-600 to-black h-fit relative ">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-none ">
          <img src="/hero.png" alt="Hero img" width={700} height={700} />
        </div>
        { authModal.isOpen && <AuthModal/>}
      </div>
    </div>
  )
}
