import React, { FC } from 'react';

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  return (
    <div className="h-24 w-full bg-white border-t">
      <div className="container mx-auto py-6">
        <span>© Whatever rights exist, all of them are reserved</span>
      </div>
    </div>
  );
};

export default Footer;
