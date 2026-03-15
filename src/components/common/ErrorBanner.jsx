import React from "react";

const ErrorBanner = ({ message, style }) =>
  message ? (
    <div className="error-banner" style={style}>
      {message}
    </div>
  ) : null;

export default ErrorBanner;
