import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 21px;

  &:hover {
    background: #252831;
    border-left: 4px solid #f44336;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
  font-size: 18px;
`;

const DropdownLink = styled(Link)`
  background: #414757;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;

  &:hover {
    background: #f44336;
    cursor: pointer;
  }
`;

const SubMenu = ({ item }) => {
  const [subNav, setSubNav] = useState(false);

  const showSubnav = () => setSubNav(!subNav);

  return (
    <>
      <div onClick={item.subNav && showSubnav}>
        <SidebarLink href={item.subNav ? "#" : item.path}>
          <div>
            {item.icon}
            <SidebarLabel>{item.title}</SidebarLabel>
          </div>
          <div>
            {item.subNav && subNav
              ? item.iconOpened
              : item.subNav
              ? item.iconClosed
              : null}
          </div>
        </SidebarLink>
      </div>
      {subNav &&
        item.subNav.map((subItem, index) => {
          return (
            <DropdownLink href={subItem.path} key={index}>
              {subItem.icon}
              <SidebarLabel>{subItem.title}</SidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};

export default SubMenu;