"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Menu, PanelLeftClose } from 'lucide-react';
import SidebarData from './SidabarData';
import SubMenu from './SubMenu';

const Nav = styled.div`
  background: #1e1e1e;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #1e1e1e;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  transition: 350ms;
  z-index: 10;
  transform: ${({ sidebar }) => (sidebar ? 'translateX(0)' : 'translateX(-100%)')};
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (sidebar) {
      mainContent.style.transform = 'translateX(250px)';
      mainContent.style.transition = 'transform 350ms';
    } else {
      mainContent.style.transform = 'translateX(0)';
      mainContent.style.transition = 'transform 350ms';
    }
  }, [sidebar]);

  return (
    <>
      <Nav>
        <NavIcon href="#">
          <Menu onClick={showSidebar} />
        </NavIcon>
      </Nav>
      <SidebarNav sidebar={sidebar ? 1 : 0}>
        <SidebarWrap>
          <NavIcon href="#">
            <PanelLeftClose onClick={showSidebar} />
          </NavIcon>
          {SidebarData.map((item, index) => {
            return <SubMenu item={item} key={index} />;
          })}
        </SidebarWrap>
      </SidebarNav>
    </>
  );
};

export default Sidebar;