// src/components/admin/ViewCommentModal.jsx
import React, { useState, useEffect } from "react";
import { Eye, User, Calendar, Star, Location, Buildings } from 'iconsax-react';
import enFlag from "../../assets/flags/en.png";

const ViewCommentModal = ({ comment, onClose }) => {
  const [loading, setLoading] = useState(false);

  if (!comment) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4 w-full max-w-2xl bg-white rounded-xl shadow-lg p-4 m-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-end items-center gap-2 w-full border-b border-gray-300 pb-2">
          <div className="flex pb-2 items-center gap-2 flex-1">
            <div className="flex items-center gap-2">
              <Eye size="32" color="#2BA6A4" />
              <h2 className="text-xl font-bold text-right" style={{ color: "#124645" }}>
                View Comment
              </h2>
            </div>
          </div>

          {/* <div className="flex h-12 py-3 items-center gap-2">
            <img src={enFlag} alt="English" className="w-6 h-6 rounded-sm" />
            <span className="text-gray-900 text-xl font-medium">English</span>
          </div> */}
        </div>

        <div className="flex flex-col items-start gap-6 w-full">
          {/* Tour Information */}
          <div className="w-full bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-danim-800 mb-3">Tour Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Buildings size="20" color="#6581BE" />
                <div>
                  <span className="text-sm text-gray-600">Tour Title:</span>
                  <p className="font-medium text-gray-800">{comment.tour_title || 'Unknown Tour'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Location size="20" color="#6581BE" />
                <div>
                  <span className="text-sm text-gray-600">City:</span>
                  <p className="font-medium text-gray-800">{comment.city_name || 'Unknown City'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-danim-800 mb-3">Client Information</h3>
            
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {comment.profile_image_url ? (
                  <img 
                    src={comment.profile_image_url} 
                    alt={comment.client_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size="24" color="#8A8D95" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <User size="20" color="#6581BE" />
                  <span className="font-semibold text-lg text-danim-800">{comment.client_name}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size="20" color="#6581BE" />
                  <span className="text-gray-600">{formatDate(comment.review_date || comment.created_at)}</span>
                </div>
                
                {comment.rating && (
                  <div className="flex items-center gap-2">
                    <Star size="20" color="#FFC107" variant="Bold" />
                    <span className="text-gray-600">{comment.rating}/5 Stars</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comment Content */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-danim-800 mb-3">Comment</h3>
            <div className="bg-danim-50 rounded-lg p-6">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {comment.comment}
              </p>
            </div>
          </div>

          {/* Client Image if exists */}
          {comment.client_image_url && (
            <div className="w-full">
              <h3 className="text-lg font-semibold text-danim-800 mb-3">Attached Image</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <img 
                  src={comment.client_image_url} 
                  alt="Client uploaded image"
                  className="max-w-full h-auto rounded-lg border-2 border-gray-200"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex px-0 py-4 items-center gap-4 w-full">
            <button
              onClick={onClose}
              className="flex px-4 py-2 justify-center items-center gap-3 flex-1 rounded bg-teal-700 hover:bg-teal-800 transition-colors"
            >
              <span className="text-xl font-semibold" style={{ color: "#EAF6F6" }}>
                Close
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCommentModal;