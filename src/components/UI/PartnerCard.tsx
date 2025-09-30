import React from 'react';
import { Partner } from '../types/Partner';
import Image from 'next/image'

interface PartnerCardProps {
  partner: Partner;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  console.log(partner);
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="p-6">

        {/* KHỐI MỚI: Căn giữa Logo và Tiêu đề */}
        <div className="flex flex-col items-center justify-center mb-4">

          {/* 1. Logo (Căn giữa) */}
          <div className="relative mb-3"> {/* Thêm mb-3 để tạo khoảng cách với tiêu đề */}
            <img
              src={partner.logo_url}
              alt={`Logo của ${partner.name}`}

              className="h-16 "
            />
            {/* Vị trí chấm xanh không đổi so với ảnh */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              {partner.title}
            </h3>
            {/* Đường kẻ gradient cũng được căn giữa cùng với khối cha */}
            <div className="flex justify-center mt-1">
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
        {/* HẾT KHỐI MỚI */}


        <p style={{ whiteSpace: 'pre-wrap' }} className="text-gray-600 text-sm leading-relaxed text-center"> {/* Thêm text-center cho đoạn mô tả */}
          {partner.note}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
          Đối tác tin cậy
        </span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};