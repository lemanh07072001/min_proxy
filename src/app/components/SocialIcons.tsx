"use client"

import React from 'react';

import { Phone, Facebook, Send } from 'lucide-react';

const SocialIcons = () => {
  return (
    <div className="social-icons">
      <button className="social-btn social-phone" title="Hotline">
        <Phone size={20} />
      </button>
      <button className="social-btn social-facebook" title="Facebook">
        <Facebook size={20} />
      </button>
      <button className="social-btn social-telegram" title="Telegram">
        <Send size={20} />
      </button>
    </div>
  );
};

export default SocialIcons;