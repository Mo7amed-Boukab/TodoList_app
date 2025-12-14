import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const FilterButton = ({ options, value, onChange, icon: Icon, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const activeOption = options.find(opt => opt.value === value);
    const activeLabel = activeOption ? activeOption.label : options[0].label;

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between gap-3 px-4 py-2.5 bg-white border rounded text-sm font-medium transition-all w-full min-w-[140px] ${isOpen
                    ? 'border-gray-300 text-gray-900'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900'
                    }`}
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={16} className="text-gray-400" />}
                    <span>{activeLabel}</span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-full min-w-[180px] bg-white border border-gray-100 shadow-xl rounded z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between group transition-colors ${value === option.value ? 'text-gray-900 font-medium bg-gray-50/50' : 'text-gray-600'
                                }`}
                        >
                            <span>{option.label}</span>
                            {value === option.value && (
                                <Check size={14} className="text-gray-900" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FilterButton;
