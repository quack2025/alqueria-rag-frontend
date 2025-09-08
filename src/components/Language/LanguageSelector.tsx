import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, ChevronDown, Check } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English', 
    flag: '🇺🇸' 
  },
  { 
    code: 'es', 
    name: 'Spanish', 
    nativeName: 'Español', 
    flag: '🇪🇸' 
  },
  { 
    code: 'fr', 
    name: 'French', 
    nativeName: 'Français', 
    flag: '🇫🇷' 
  }
];

interface LanguageSelectorProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'dropdown' | 'compact';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '', 
  showLabel = true,
  variant = 'dropdown'
}) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    
    // Save to localStorage for persistence
    localStorage.setItem('selectedLanguage', languageCode);
  };

  if (variant === 'compact') {
    return (
      <div className={`relative inline-block ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          title={t('config.selectLanguage')}
        >
          <Languages className="h-4 w-4 text-gray-600" />
          <span className="text-lg">{currentLanguage.flag}</span>
          <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  language.code === i18n.language ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base">{language.flag}</span>
                  <span>{language.nativeName}</span>
                </div>
                {language.code === i18n.language && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700">
          {t('config.language')}
        </label>
      )}
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">{currentLanguage.flag}</span>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">
                {currentLanguage.nativeName}
              </div>
              <div className="text-xs text-gray-500">
                {currentLanguage.name}
              </div>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  language.code === i18n.language ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{language.flag}</span>
                  <div className="text-left">
                    <div className={`text-sm font-medium ${
                      language.code === i18n.language ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {language.nativeName}
                    </div>
                    <div className={`text-xs ${
                      language.code === i18n.language ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {language.name}
                    </div>
                  </div>
                </div>
                {language.code === i18n.language && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500">
        {t('config.selectLanguage')}
      </div>
    </div>
  );
};

export default LanguageSelector;