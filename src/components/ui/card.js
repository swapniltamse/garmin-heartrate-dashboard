import React from "react";

const Card = ({ children, className }) => {
  return <div className={`border rounded-lg p-4 shadow ${className}`}>{children}</div>;
};

const CardContent = ({ children }) => {
  return <div className="p-2">{children}</div>;
};

export { Card, CardContent };
