import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  headerTitle: string;
}

export function PhoneFrame({ children, headerTitle }: PhoneFrameProps) {
  return (
    <div className="flex justify-center items-center py-8 bg-[#FAFAFA] min-h-full">
      <div className="relative mx-auto border-gray-800 border-[14px] rounded-[2.5rem] h-[800px] w-[380px] shadow-xl overflow-hidden bg-white">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-b-3xl w-40 mx-auto z-20"></div>

        {/* Header */}
        <div className="bg-[#C74634] text-white pt-10 pb-4 px-4 text-center font-semibold z-10 relative shadow-sm">
          {headerTitle}
        </div>

        {/* Content */}
        <div className="h-[calc(800px-110px)] overflow-y-auto w-full relative bg-gray-50 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
