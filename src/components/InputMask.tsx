import React from 'react';
import { Input } from './ui/input';
//@ts-ignore
import InputMask from 'react-input-mask';

interface MaskedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MaskedInput: React.FC<MaskedInputProps> = ({
  value,
  onChange,
  placeholder = 'Digite o telefone...',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <InputMask mask="(99) 99999-9999" value={value} onChange={handleChange}>
      {(inputProps: any) => (
        <Input
          {...inputProps}
          className="col-span-3"
          placeholder={placeholder}
        />
      )}
    </InputMask>
  );
};

export default MaskedInput;
