
'use client'

import { useRef, useState, useEffect } from 'react'

import { usePathname } from 'next/navigation'

import "@components/language-selector/main.css"

import LanguagesData from '@/data/languages/languagesData'
import { useLanguageSwitcher, getCurrentLocale } from '@/utils/languageUtils'

export default function LanguageSelect() {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { switchLanguage } = useLanguageSwitcher()
  
  // Lấy ngôn ngữ hiện tại từ URL
  const currentLocale = getCurrentLocale(pathname)
  const currentLanguage = LanguagesData.find(lang => lang.code === currentLocale)

  const handleLanguageChange = (languageCode: string) => {
    setShowLanguageDropdown(false)
    switchLanguage(languageCode as any)
  }

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    
return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Language Selector */}
      <div className="language-selector" ref={dropdownRef}>
        <button
          className="language-toggle"
          onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          type="button"
        >
          <span className="language-flag">{currentLanguage?.flag}</span>
          <span className="language-code">{currentLanguage?.code.toUpperCase()}</span>
          <svg
            className={`language-arrow ${showLanguageDropdown ? 'rotated' : ''}`}
            width="12"
            height="12"
            viewBox="0 0 12 12"
          >
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </button>

        {showLanguageDropdown && (
          <div className="language-dropdown">
            {LanguagesData.map((language) => (
              <button
                key={language.code}
                className={`language-option ${currentLocale === language.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(language.code)}
              >
                <span className="option-flag">{language.flag}</span>
                <span className="option-name">{language.name}</span>
                {currentLocale === language.code && (
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
