import React, {useState, useEffect} from 'react';
import {cloneDeep, isString, isEqual } from 'lodash';
import {Col, Row, Container, Button} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {Dispatch} from 'redux';
import InputField from 'common/InputField/InputField'
import UtSelect from 'common/Select/Select'
import withSnackbar from 'common/Snackbar/Snackbar';
import {styled} from '@mui/material/styles';
import {Paper, Avatar, IconButton, EditIcon, Backdrop,
  CircularProgress} from 'lib/mui-shared';
import {updateProfile} from 'lib/auth/auth.action'
import {updateOneProfile} from 'api/user/profile';

import './MyAccount.scss';

const INIT_STATE = {
  fields: {
    username: '',
    email: '',
    country: 'TW',
    avatar: null
  },
  fieldErrors: {}
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ListItem = styled('li')(({theme}) => ({
  margin: theme.spacing(0.5)
}));
const MyAccount = (prop) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [form, setForm] = useState(cloneDeep(INIT_STATE));
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<Blob | string>(new Blob())
  const [profile, setProfile] = useState<{
    email: string;
    country: string;
    username: string;
  }>({email: '', country: '', username: ''});
  const dispatch: Dispatch<any> = useDispatch()
  const {user} = useSelector((state: {auth: any}) => {
    return state.auth;
  });
  const getProfile = async () => {
    const profile = {
      email: user.email,
      country: user.country,
      username: user.username,
    }

    const newForm = cloneDeep(form)
    newForm.fields = cloneDeep(profile)
    setForm(newForm)
    setProfile(profile);
    setAvatar(user.avatar)
  };


  const onInputChange = ({formControlName, value, error}) => {
    const fields = form.fields;
    const fieldErrors = form.fieldErrors;

    fields[formControlName] = value;
    fieldErrors[formControlName] = error;

    setForm({fields, fieldErrors});
    setIsChanged(!isEqual(form.fields, profile))
  };

  const onFormSubmit = async (evt) => {
    const profile = form.fields;
    evt.preventDefault();
    const formData = new FormData();
    for(let [formctrl, value] of Object.entries(profile)) {
      formData.append(formctrl, value as string)
    }
    formData.append('avatar', avatar as Blob)
    setIsLoading(true)
    try {
      const {data} = await updateOneProfile(formData);
      dispatch(updateProfile(data))
      prop.snackbarShowMessage('Saved successfully')
    } catch (err) {
      prop.snackbarShowMessage('Error:' + err, 'alert')
    } finally {
      setIsLoading(false)
    }
  };

  const uploadImage = (event)=>{
    setAvatar(event.target.files[0]);
    setIsChanged(true)
  }

  useEffect(() => {
    getProfile()
  }, []);

  return (
    <Paper elevation={3}
      sx={{
        position: "relative",
        zIndex: 0
      }}
    >
    <Backdrop
      sx={{ position: "absolute", color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    <Container className="MyAccount">
      <form>
        <Row className="avatar-row">
          <Container className='avatar'>
            <Avatar className='avatar-img' src={isString(avatar)? avatar as string: URL.createObjectURL(avatar as Blob)} />
            <IconButton
              className="upload-btn"
              component="label" size="small">
              <EditIcon />
              <input
                type="file"
                onChange={uploadImage}
                hidden
              />
            </IconButton>
          </Container>
        </Row>
        <svg id="curveDownColor" xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 C 50 65 50 50 100 0 Z" />
        </svg>
        <Row>
          <InputField
            value={form.fields.username}
            name="Username"
            formControlName="username"
            placeholder=""
            type="text"
            onChange={onInputChange}
          ></InputField>
        </Row>
        <Row>
          <InputField
            value={form.fields.email}
            name="Email"
            disabled={true}
            formControlName="email"
            placeholder=""
            type="text"
            onChange={onInputChange}
          ></InputField>
        </Row>
        <Row>
          <UtSelect
            value={form.fields.country}
            name="Country"
            options={[]}
            formControlName="country"
            onChange={onInputChange}
          ></UtSelect>
        </Row>
        <Row className="btn-container">
          <Button className="btn btn-primary centerButton" disabled={!isChanged} onClick={onFormSubmit}>
            Update
          </Button>
        </Row>
        </form>
    </Container>
    </Paper>
  );
};

export default withSnackbar(MyAccount);
