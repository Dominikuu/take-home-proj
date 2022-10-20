import React,{ useEffect, useState } from 'react';
import {cloneDeep, isEqual} from 'lodash';
import {styled} from '@mui/material/styles';
import {Popover, LoadingButton, Typography, ImageIcon, Tabs, Tab, Box} from "lib/mui-shared";
import ImageUpload from 'common/ImageUpload/ImageUpload'
import InputField from 'common/InputField/InputField'
import {validUrl} from 'lib/validator/url'
interface TabPanelProps {
  children?: React.ReactNode;
  index: TabNum;
  value: number;
}

enum TabNum {
  Upload = 0,
  Url = 1
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: TabNum) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const INIT_STATE = {
  link: ''
};

const ActionButton = styled(LoadingButton)({
  background: '#fff',
  border: "1px solid #ff0000",
  borderRadius: '2rem',
  color: '#ff0000',
  padding: '0.25rem 0.5rem',
  'text-transform': 'inherit',
  "&:hover":{
    backgroundColor: "#ff0000",
    borderColor: "#ff0000",
    color: '#fff',
  },
  ":disabled": {
    border: '#ebebeb'
  }

});

const ImageButton = (props)=>{
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [form, setForm] = useState(cloneDeep(INIT_STATE));
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState<boolean>(false)
  const [tab, setTab] = useState<TabNum>(TabNum.Url);
  const {link} = form
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleTabChange = (event: React.SyntheticEvent, newValue: TabNum) => {
    setTab(newValue);
    setForm(cloneDeep(INIT_STATE))
    setFieldErrors({})
    setIsFormChanged(false)
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }
    setAnchorEl(event.currentTarget);
    setTab(TabNum.Upload)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onAddClick = ()=>{
    setLoading(true)
    const callback = (link)=>{
      props.option.insertImageCallback(link)
      handleClose()
      setLoading(false)
    }
    if (tab === TabNum.Url) {
      callback(form.link)
    } else {
      props.option.uploadCallback(imageFile).then(({data: {link}})=>callback(link))
    }
  }
  const onCancelClick = ()=>{
    handleClose()
  }

  const onInputChange = ({formControlName, value, error}) => {
    if (tab === TabNum.Upload) {
      setImageFile(value)
    }

    const _fieldErrors = cloneDeep(fieldErrors);

    if (!error) {
      delete _fieldErrors[formControlName]
    } else {
      _fieldErrors[formControlName] = error
    }
    setForm((prev)=>({
      ...prev,
      [formControlName]: value
    }));
    setIsFormChanged(!isEqual({...form, [formControlName]: value}, INIT_STATE))
    setFieldErrors(_fieldErrors)
  };

  return (
    <div className='headlineButtonWrapper'>
      <button onClick={handleClick} className='headlineButton'>
        <ImageIcon/>
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{ padding: 15 }}
      >
        <div style={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
              <Tab label="Upload" {...a11yProps(TabNum.Upload)} />
              <Tab label="Url" {...a11yProps(TabNum.Url)} />
            </Tabs>
          </Box>
          <TabPanel value={tab} index={TabNum.Upload} >
            <ImageUpload
              value={props.url}
              name=""
              formControlName="image"
              onChange={onInputChange}
              option={{}}
            ></ImageUpload>

          </TabPanel>
          <TabPanel value={tab} index={TabNum.Url}>
            <InputField required={true} placeholder="" validate={validUrl}
              type="text" name="" value={link} formControlName="link" onChange={onInputChange}></InputField>
          </TabPanel>
          <Box className="action-btn-wrapper">
            <ActionButton className="btn btn-primary centerButton"
              onClick={onAddClick}
              variant="contained"
              disabled={!isFormChanged || Object.keys(fieldErrors).length !== 0}
            >
              Add
            </ActionButton>
            <ActionButton className="btn btn-primary centerButton"
              onClick={onCancelClick}
              variant="contained"
            >
              Cancel
            </ActionButton>
          </Box>
        </div>
      </Popover>
    </div>
  )

}

export default ImageButton
