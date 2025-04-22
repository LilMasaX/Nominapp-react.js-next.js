'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Importar el componente Image
import { Menu, PanelLeftClose } from 'lucide-react';
import styles from '@/components/sidebar/sidebar.module.css';
import SidebarData from './SidabarData';
import SubMenu from './SubMenu';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <div className={styles.nav}>
        <Link 
          href="#" 
          className={styles.navIcon}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className={styles.icon} />
        </Link>
        
        <div className={styles.logoContainer}>
          <Image
            src="/logo.webp" // Ruta absoluta
            alt="Logo de la empresa"
            width={100} // Ajusta según el tamaño real del logo
            height={100} // Ajusta según el tamaño real del logo
            className={styles.logo}
          />
        </div>
      </div>
      
      <nav className={`${styles.sidebarNav} ${
        sidebarOpen ? styles.sidebarNavOpen : styles.sidebarNavClosed
      }`}>
        <div className={styles.sidebarWrap}>
          <Link 
            href="#" 
            className={styles.navIcon}
            onClick={() => setSidebarOpen(false)}
          >
            <PanelLeftClose className={styles.icon} />
          </Link>
          {SidebarData.map((item) => (
            <SubMenu key={item.title} item={item} />
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;