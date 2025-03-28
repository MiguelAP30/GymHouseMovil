import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  size = 5
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const halfSize = Math.floor(size / 2);
    
    let startPage = Math.max(1, currentPage - halfSize);
    let endPage = Math.min(totalPages, startPage + size - 1);
    
    if (endPage - startPage + 1 < size) {
      startPage = Math.max(1, endPage - size + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <View className="flex-row justify-center items-center space-x-2 mt-4">
      <TouchableOpacity
        className={`px-4 py-2 rounded-lg ${
          currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500'
        }`}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Text className={`${currentPage === 1 ? 'text-gray-500' : 'text-white'}`}>
          Anterior
        </Text>
      </TouchableOpacity>

      {getPageNumbers().map((page) => (
        <TouchableOpacity
          key={page}
          className={`px-4 py-2 rounded-lg ${
            currentPage === page ? 'bg-blue-500' : 'bg-gray-200'
          }`}
          onPress={() => onPageChange(page)}
        >
          <Text className={currentPage === page ? 'text-white' : 'text-gray-700'}>
            {page}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        className={`px-4 py-2 rounded-lg ${
          currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500'
        }`}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Text className={`${currentPage === totalPages ? 'text-gray-500' : 'text-white'}`}>
          Siguiente
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;
