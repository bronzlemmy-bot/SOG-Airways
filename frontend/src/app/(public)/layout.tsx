import PublicNavbar from "@/components/public/publicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicNavbar />
      {children}
      <PublicFooter />
    </>
  );
}