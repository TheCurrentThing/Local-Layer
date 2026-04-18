export const dynamic = "force-dynamic";

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('admin-theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-admin-theme', t);
    }
  } catch(e) {}
})();
`;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth enforced by middleware for all /admin/* routes (excluding /admin/login).
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      {children}
    </>
  );
}
