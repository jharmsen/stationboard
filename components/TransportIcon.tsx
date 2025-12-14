import React from 'react';
import { Bus, Train, Ship, TramFront, CableCar, HelpCircle } from 'lucide-react';
import { TRANSPORT_TYPE_MAP } from '../constants';

interface TransportIconProps {
  category: string; // e.g., "IC", "B", "T"
  className?: string;
}

const TransportIcon: React.FC<TransportIconProps> = ({ category, className = "w-5 h-5" }) => {
  const type = TRANSPORT_TYPE_MAP[category] || 'train';

  switch (type) {
    case 'bus':
      return <Bus className={className} />;
    case 'tram':
      // Lucide sometimes doesn't have TramFront in older versions, fallback to generic if needed, 
      // but assuming recent version. If not, Train is a safe fallback.
      return <TramFront className={className} />;
    case 'ship':
      return <Ship className={className} />;
    case 'cable':
      return <CableCar className={className} />;
    case 'train':
      return <Train className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};

export default TransportIcon;
