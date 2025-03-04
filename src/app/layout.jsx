import ClientLayout from '@/components/ClientLayout/ClientLayout'
import './styles/globals.css';

export const metadata = {
  title: 'Nominapp',
  description: 'Sistema de nómina',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}