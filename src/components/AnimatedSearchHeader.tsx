import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar } from 'lucide-react';

interface AnimatedSearchHeaderProps {
  panelHeight: number;
  maxHeight: number;
  minHeight: number;
  onWhereToClick: () => void;
  onScheduleClick: () => void;
}

export const AnimatedSearchHeader: React.FC<AnimatedSearchHeaderProps> = ({
  panelHeight,
  maxHeight,
  minHeight,
  onWhereToClick,
  onScheduleClick
}) => {
  const heightRange = maxHeight - minHeight;
  const normalizedHeight = (panelHeight - minHeight) / heightRange;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md border-b border-gray-100"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="space-y-4 px-4 py-4"
        animate={{
          opacity: normalizedHeight < 0.5 ? 1 : 0.7
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <button
              onClick={onWhereToClick}
              className="w-full bg-gray-100 rounded-xl pl-12 pr-4 py-4 text-left text-gray-500 hover:bg-gray-200 transition-colors font-medium"
            >
              Where to?
            </button>
          </div>
          <button
            onClick={onScheduleClick}
            className="bg-gray-100 rounded-xl p-4 hover:bg-gray-200 transition-colors"
          >
            <Calendar className="text-gray-600" size={20} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
