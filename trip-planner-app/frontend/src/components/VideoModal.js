import React from "react";

export default function VideoModal({ videoUrl, onClose }) {
 return (
   <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
     <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
       <button
         onClick={onClose}
         className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
       >
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
         </svg>
       </button>
       <div className="relative pt-[56.25%]">
         <iframe
           className="absolute inset-0 w-full h-full border-0"
           src={videoUrl}
           title="Video player"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           allowFullScreen
         ></iframe>
       </div>
     </div>
   </div>
 );
}
