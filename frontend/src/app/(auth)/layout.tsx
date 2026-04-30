export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A3966A] via-[#895D2B] to-[#482E1D] flex items-center justify-center p-4">
      {children}
    </div>
  );
}
