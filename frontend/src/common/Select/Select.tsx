import React, {useState, useEffect, ChangeEvent} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {MenuItem, Select, TextField} from 'lib/mui-shared'
import { SelectChangeEvent } from '@mui/material/Select';

import {Error, FormCtrlProps} from 'common/shared.definition';
import './Select.scss';

interface SelectProps<T> extends FormCtrlProps<T> {
  exclusive?: boolean;
  value: T;
  options: {name: string; code: string}[];
}

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 170
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
  },
}));


const UtSelect: React.FC<SelectProps<string>> = ({value, formControlName, name, options, validate, onChange}) => {
  const classes = useStyles();
  const [state, setState] = useState<{value: string; error: boolean | Error}>({
    value,
    error: false
  });

  useEffect(() => {
    setState({value, error: false});
  }, [value]);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    const error: boolean | Error = validate ? validate(value) : false;
    setState({value, error});
    onChange && onChange({formControlName, error, value});
  };

  return (
    <div className="field">
      <div className="label">{name}</div>
      <TextField
        sx={{
          marginTop: 1,
          '& legend': { display: 'none' },
          '& fieldset': { top: 0 },
          }}
        select
        className={classes.textField}
        value={state.value}
        onChange={handleChange}
        InputLabelProps={{shrink: false}}
        SelectProps={{
          MenuProps: {
            className: classes.menu,
          },
        }}
        margin="normal"
        variant="outlined"
      >
        {options.map(({name, code})=><MenuItem key={code} value={code}>{name}</MenuItem>)}
      </TextField>

      {state.error? 
        <div className="ui visible warning message">{Object.values(state.error)[0]}</div>
        : null
      }
    </div>
  );
};

export default UtSelect;
