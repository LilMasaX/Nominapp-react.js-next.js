"use client";
import React, { useMemo } from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  border-radius: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #1e1e1e;
  color: #ffffff;
  box-shadow: 0 4px 6px rgba(46, 9, 9, 0.1), 0 1px 3px rgba(121, 36, 36, 0.06);
  padding: 1.5rem;
  margin: 1rem auto;
`;

function Card({ children, size = 'sm' }) {
  const sizes = {
    sm: '40vw',
    md: '70vw',
    lg: '90vw',
  };

  const cardStyle = useMemo(() => ({
    maxWidth: sizes[size] || sizes.md,
  }), [size]);

  return <CardContainer style={cardStyle}>{children}</CardContainer>;
}

export default Card;