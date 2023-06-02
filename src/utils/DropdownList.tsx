import React, { memo, useEffect, useRef, useState } from 'react';
import { ReactComponent as ChevronDownIcon } from '../assets/chevron-down-sharp.svg';
import { ReactComponent as ChevronUpIcon } from '../assets/chevron-up-sharp.svg';
export interface IOption {
  label: string;
  value: string;
}

const DropdownList = ({
  className,
  options,
  onSelect,
}: {
  className: string;
  options: IOption[];
  onSelect: (option: IOption) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<IOption | null>(null);
  const dropDownListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        dropDownListRef.current &&
        !dropDownListRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleOptionClick = (option: IOption) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  const toggleComboBox = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropDownListRef}>
      <div
        className={`flex justify-between border-2 py-1 px-2 ${className}`}
        onClick={toggleComboBox}
      >
        <span
          className={`font-normal text-sx sm:text-sm md:text-base ${
            selectedOption ? 'text-black' : 'text-grey-medium'
          }`}
        >
          {selectedOption ? selectedOption.label : 'Select language'}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="text-grey-medium" />
        ) : (
          <ChevronDownIcon className="text-grey-medium" />
        )}
      </div>
      {isOpen && (
        <div className="bg-[#ffffff] absolute w-full border-2 border-grey-medium border-t-0 py-1 pl-2">
          {options.map((option) => (
            <div
              className="py-2"
              key={option.value}
              onClick={() => handleOptionClick(option)}
            >
              <span className="font-normal">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(DropdownList);
