import React, {useState, useEffect, MouseEvent} from 'react';
import {ToggleButtonGroup, ToggleButton} from 'lib/mui-shared'
import {Error, FormCtrlProps} from 'common/shared.definition';
import './ToggleButtonGroup.scss';

interface ToggleButtonGroupProps<T> extends FormCtrlProps<T> {
  options: {label: string; value: any}[];
  exclusive?: boolean;
}
const UtfToggleButtonGroup: React.FC<ToggleButtonGroupProps<string | string[]>> = ({
  value,
  formControlName,
  name,
  placeholder,
  type,
  validate,
  onChange,
  options,
  exclusive
}) => {
  const [state, setState] = useState<{value: string|string[], error: boolean | Error}>({
    value,
    error: false
  });

  useEffect(() => {
    setState({value, error: false});
  }, [value]);

  const handleChange = (evt: MouseEvent<HTMLElement>, newValue: string | string[]) => {
    const error: boolean | Error = validate ? validate(newValue) : false;
    setState({value: newValue, error});

    onChange && onChange({formControlName, value: newValue, error});
  };

  return (
    <div className="ToggleButtonGroup">
      <div className="label">{name}</div>
      <ToggleButtonGroup value={state.value} exclusive={exclusive} onChange={handleChange} aria-label="text alignment">
        {options?.map(({value, label}, i) => {
          return (
            <ToggleButton key={i} value={value} aria-label={value}>
              {label}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>

      {state.error?
        <div className="ui visible warning message">{Object.values(state.error)[0]}</div>
        : null
      }
    </div>
  );
};

export default UtfToggleButtonGroup;
