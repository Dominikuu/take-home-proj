import React, {useState, useEffect} from 'react';
import {cloneDeep} from 'lodash'
import {Error, FormCtrlProps} from 'common/shared.definition';
import {Input, Box, InputLabel, FormHelperText} from 'lib/mui-shared';
import './InputField.scss';

const InputField: React.FC<FormCtrlProps<string>> = (prop) => {
  const {value, formControlName, name, placeholder, type, required, validate, onChange, disabled} = prop
  const [state, setState] = useState<string>(cloneDeep(value));
  const [error, setError] = useState<boolean | Error>(false)

  const onInputFieldChanged = (evt) => {
    const value = evt.target.value;
    const error: boolean | Error = validateFormfield(value);
    setState(value)
    setError(error)
    onChange && onChange({formControlName, value, error});
  };

  const onInputFocus = (event)=>{
    if (event) {
      event.stopPropagation();
    }
  }

  const validateFormfield = (val: any): boolean | Error=>{

    if (!val && required) {
      return {required: 'Couldnt be EMPTY'}
    }
    return validate ? validate(val): false
  }

  useEffect(() => {
    const error: boolean | Error = validateFormfield(prop.value);
    setState(prop.value)
    setError(error)
    onChange && onChange({formControlName, value:prop.value, error});
  }, [prop.value])

  return (
    <Box className="inputField field">
      <InputLabel className="label">{name}{required && (<span className="required">*</span>)}</InputLabel>
      <Input disabled={disabled} type={type} placeholder={placeholder} value={state} onChange={onInputFieldChanged} onClick={onInputFocus}/>

      {error !== false?
        Object.keys(error).map((errKey)=> <FormHelperText key={errKey} className="ui visible warning message">{error[errKey]}</FormHelperText>
        )
        : null
      }
    </Box>
  );
};

export default InputField;
