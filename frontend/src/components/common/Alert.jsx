function Alert({ type = "error", children }) {
  return (
    <div className={`alert ${type}`}>
      {children}
    </div>
  );
}

export default Alert;