function Button({
  children,
  type = "button",
  loading = false,
  disabled = false,
  onClick,
}) {
  return (
    <button
      type={type}
      className="btn"
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;