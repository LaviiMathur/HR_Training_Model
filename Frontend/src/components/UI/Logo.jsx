export default function Logo({ h = 50, className }) {
  return (
    <img
      src="/Logo.png"
      style={{ height: h, width: h }}
      className={`object-contain ${className}`}
      alt="Logo"
    />
  );
}

