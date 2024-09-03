import React from 'react';

interface NotificationBadgeProps {
  message: string;
  onClose: () => void;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-0 left-0 right-0 p-4 bg-green-500 text-white text-center shadow-lg">
      {message}
      <button onClick={onClose} className="ml-4 font-bold">
        X
      </button>
    </div>
  );
};

export default NotificationBadge;
