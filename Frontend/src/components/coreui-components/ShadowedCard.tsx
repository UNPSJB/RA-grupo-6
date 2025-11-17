import React from 'react';
import { CCard,  } from '@coreui/react';
import type { CCardProps } from '@coreui/react/dist/esm/components/card/CCard';

/**
 * Un componente CCard de CoreUI con una sombra (`shadow-sm`) aplicada por defecto.
 * Acepta todas las props de CCard.
 */
const ShadowedCard: React.FC<CCardProps> = ({ children, className, ...rest }) => {
  const cardClassName = ['shadow-sm ', className].filter(Boolean).join(' ');

  return <CCard className={cardClassName} {...rest}>{children}</CCard>;
};

export default ShadowedCard;