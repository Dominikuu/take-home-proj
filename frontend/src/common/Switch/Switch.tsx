import React, {useState, useEffect, ChangeEvent} from 'react';
import MuiSwitch from '@mui/material/Switch';
import {Error, FormCtrlProps} from 'common/shared.definition';
import './Switch.scss';

interface SwitchProps<T> extends FormCtrlProps<T> {
  exclusive?: boolean;
  value: T;
}
const Switch: React.FC<SwitchProps<boolean>> = ({value, formControlName, name, validate, onChange}) => {
  const [state, setState] = useState<{value: boolean; error: boolean | Error}>({
    value,
    error: false
  });

  useEffect(() => {
    setState({value, error: false});
  }, [value]);

  const handleChange = (evt: ChangeEvent<HTMLElement>, newValue: boolean) => {
    const error: boolean | Error = validate ? validate(newValue) : false;
    setState({value: newValue, error});
    onChange && onChange({formControlName, value: newValue, error});
  };

  return (
    <div className="Switch">
      <div className="label">{name}</div>
      <MuiSwitch checked={state.value} onChange={handleChange} />

      {state.error ? <div className="ui visible warning message">{Object.values(state.error)[0]}</div> : null}
    </div>
  );
};

export default Switch;
