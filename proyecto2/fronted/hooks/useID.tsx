import { useState, useEffect } from 'react';

// Hook para gestionar el ID de usuario
const useID = () => {
  const [userID, setUserID] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('user_id') : null
  );

  // Guarda el ID en localStorage cada vez que se actualice
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (userID) {
        localStorage.setItem('user_id', userID);
      } else {
        localStorage.removeItem('user_id');
      }
    }
  }, [userID]);

  return {
    userID,
    setUserID,
  };
};

export default useID;
