import React from 'react';

export default function Loading() {
  return (
    <div
      className="fixed left-1/2 top-1/2"
      id="loading"
    >
      <img
        srcSet={"/images/load.gif"}
        alt="Load indicator"
        className="w-16 h-16 mx-auto"
      />
    </div>
  );

  /*
  return (
    <svg className="spinner" viewBox="0 0 50 50">
      <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
    </svg>
  );
  */
}