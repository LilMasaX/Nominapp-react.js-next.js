'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './sidebar.module.css';

const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);

  return (
    <>
      <div className={styles.sidebarLink} onClick={() => item.subNav && setSubnav(!subnav)}>
        <Link href={item.subNav ? '#' : item.path} className={styles.sidebarLink}>
          <div className={styles.sidebarLinkContent}>
            {item.Icon && <item.Icon className={styles.icon} />}
            <span className={styles.sidebarLabel}>{item.title}</span>
          </div>
          <div>
            {item.subNav && (
              subnav 
                ? <item.IconOpened className={styles.icon} />
                : <item.IconClosed className={styles.icon} />
            )}
          </div>
        </Link>
      </div>
      {subnav && item.subNav?.map((subItem) => (
        <Link
          key={subItem.title}
          href={subItem.path}
          className={styles.dropdownLink}
        >
          {subItem.Icon && <subItem.Icon className={styles.icon} />}
          <span className={styles.sidebarLabel}>{subItem.title}</span>
        </Link>
      ))}
    </>
  );
};

export default SubMenu;