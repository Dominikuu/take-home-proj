import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {cloneDeep, isEqual} from 'lodash';
import {Col, Row, Button, Container} from 'react-bootstrap';
import {EditorState, convertToRaw} from 'draft-js';
import {useNavigate} from 'react-router-dom';
import {convertToHTML} from 'draft-convert';
import DOMPurify from 'dompurify';
import {get} from 'lodash'
import draftToHtml from 'draftjs-to-html';
import {styled} from '@mui/material/styles';

import withSnackbar from 'common/Snackbar/Snackbar';
import InputField from 'common/InputField/InputField';
import UtfToggleButtonGroup from 'common/ToggleButtonGroup/ToggleButtonGroup';
import UtfSwtich from 'common/Switch/Switch';
import ImageUpload from 'common/ImageUpload/ImageUpload'
import CustomToolbarEditor from 'common/CustomToolbarEditor/CustomToolbarEditor'
import {Role} from 'App';
import {createOnePost} from 'api/post';
import {createPostImage} from 'api/post/image/upload';
import {Link, LoadingButton} from 'lib/mui-shared';
import './Create-post.scss';
import {CATEGORY_OPTIONS, Category, Tag, TAG_OPTIONS} from './Create-post.definition';
const INIT_STATE = {
  fields: {
    title: '',
    category: Category.Product,
    tags: [Tag.Wifi, Tag.Ptmp],
    content: '',
    author: '',
    hidden: false,
    closed: false,
    is_pinned: false,
  },
  fieldErrors: {}
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

const CreatePost = (prop) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false)
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([])
  const [form, setForm] = useState(cloneDeep(INIT_STATE.fields));
  const [fieldErrors, setFieldErrors] = useState({})
  const {title, category, tags, content, author, hidden, closed, is_pinned} = form
  const authState = useSelector((state: {auth: any}) => state.auth);
  const history = useNavigate();

  const onInputChange = ({formControlName, value, error}) => {
    const _fieldErrors = cloneDeep(fieldErrors);
    console.log({formControlName, value, error})
    if (!error) {
      delete _fieldErrors[formControlName]
    } else {
      _fieldErrors[formControlName] = error
    }
    setFieldErrors(_fieldErrors)
    setIsFormChanged(!isEqual({...form, [formControlName]: value}, INIT_STATE.fields))
    setForm((prev)=>({
      ...prev,
      [formControlName]: value
    }));
  };

  const onFormSubmit = async (evt) => {
    setLoading(true)
    const post = cloneDeep(form);
    evt.preventDefault(); // prevents page from reloading on submit
    // if (this.validate()) return;
    const formData = new FormData();
    for(let [formctrl, value] of Object.entries(post)) {
      formData.append(formctrl, value as string )
    }
    try {
      const {data} = await createOnePost(formData);
      prop.snackbarShowMessage('Saved successfully').then((onClosed)=>{
        if (data) {
          history('/post/' + data.post_id)
        }
      })
    } catch (err) {
      prop.snackbarShowMessage('Error:' + err, 'alert')
      setLoading(false)
    }
  };

  const onResetClick = () => {
    setForm(cloneDeep(INIT_STATE.fields));
    setIsFormChanged(false)
    setEditorState(() => EditorState.createEmpty())
  };

  const uploadImageCallBack = async (file) =>{
    const existedImages = cloneDeep(uploadedImages);
    const formData = new FormData();
    formData.append('files', file);
    const imgUrl = await createPostImage(formData)
    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file),
    }

    existedImages.push(imageObject);
    setUploadedImages(existedImages)
    return Promise.resolve({ data: { link: imgUrl.data } })
  }

  return (
    <section className="CreatePost">
      <Container>
        <Row>
          <Link className="link" href="#" underline="none">
            {"<< Back"}
          </Link>
        </Row>
        <h4>Create a Topic</h4>
        <form>
          <Row>
            <InputField
              value={title}
              name="Title"
              formControlName="title"
              placeholder=""
              type="text"
              required={true}
              onChange={onInputChange}
            ></InputField>
          </Row>
          <Row>
            <UtfSwtich
              value={is_pinned}
              name="Pinned"
              formControlName="is_pinned"
              onChange={onInputChange}
            ></UtfSwtich>
          </Row>
          {
            (authState.user && authState.user.role === Role.Admin)?
            <>
              <Row>
                <UtfSwtich
                  value={closed}
                  name="Stop comment"
                  formControlName="closed"
                  onChange={onInputChange}
                ></UtfSwtich>
              </Row>
              <Row>
              <UtfSwtich
                value={hidden}
                name="Hide"
                formControlName="hidden"
                onChange={onInputChange}
              ></UtfSwtich>
            </Row>
          </>
            : null
          }
          <Row>
            <UtfToggleButtonGroup
              value={category}
              name="Category"
              placeholder=""
              formControlName="category"
              type="text"
              exclusive={true}
              options={CATEGORY_OPTIONS}
              onChange={onInputChange}
            ></UtfToggleButtonGroup>
          </Row>
          <Row>
            <UtfToggleButtonGroup
              value={tags}
              name="Tag"
              formControlName="tags"
              placeholder=""
              type="text"
              options={TAG_OPTIONS}
              onChange={onInputChange}
            ></UtfToggleButtonGroup>
          </Row>
          {category === Category.Announcement ?<Row>
            <ImageUpload
              value={get(form, 'field.cover')}
              name="Cover"
              formControlName="cover"
              onChange={onInputChange}
            ></ImageUpload>
          </Row>: null}
          <Row>
            <CustomToolbarEditor
              formControlName='content'
              value={content}
              name="Description"
              onChange={onInputChange}
              toolbar={{
                image: {
                  urlEnabled: true,
                  uploadEnabled: true,
                  uploadCallback: uploadImageCallBack,
                  inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                }
              }}></CustomToolbarEditor>
          </Row>
          <Row className="btn-container">
            <ActionButton className="btn btn-primary centerButton"
              loading={loading}
              onClick={onFormSubmit}
              variant="contained"
              disabled={!isFormChanged || Object.keys(fieldErrors).length !== 0}
            >
              Create
            </ActionButton>
            <ActionButton className="btn btn-primary centerButton"
              onClick={onResetClick}
              variant="contained"
              disabled={!isFormChanged}
            >
              Reset
            </ActionButton>
          </Row>
        </form>
      </Container>
    </section>
  );
};

export default withSnackbar(CreatePost);
