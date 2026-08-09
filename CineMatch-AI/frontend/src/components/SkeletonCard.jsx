import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="movie-card" style={{ borderStyle: 'dashed', opacity: 0.5 }}>
      <div className="card-poster-wrapper skeleton">
        <div className="skeleton-poster" />
      </div>
      <div className="card-info">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" style={{ width: '40%' }} />
      </div>
    </div>
  );
};

export default SkeletonCard;
