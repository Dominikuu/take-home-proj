import React, {useEffect, useState} from 'react';
import {Row} from 'react-bootstrap';
import {cloneDeep, isEqual} from 'lodash'
import {useParams} from 'react-router-dom';
import {convertToHTML} from 'draft-convert';
import {styled} from '@mui/material/styles';
import {Checkbox, FormGroup, FormControlLabel, LoadingButton} from 'lib/mui-shared';
import CustomToolbarEditor from 'common/CustomToolbarEditor/CustomToolbarEditor'
import Button from 'react-bootstrap/Button';
import {convertFromHTML, ContentState, EditorState} from 'draft-js';
import {createOneComment, updateOneComment} from 'api/comment';
import {createPostImage} from 'api/post/image/upload';
import withSnackbar from 'common/Snackbar/Snackbar';
import './CommentEditor.scss';
enum CommentAccess {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

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

});

const INIT_STATE = {content: ''}

const CommentEditor = (prop) => {
  const [loading, setLoading] = useState(false);
  const {postId} = useParams<{postId: string}>();
  const [access, setAccess] = useState<CommentAccess>(CommentAccess.Public)
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState([])
  const [form, setForm] = useState(cloneDeep(INIT_STATE));
  const [fieldErrors, setFieldErrors] = useState({})

  const onInputChange = ({formControlName, value, error}) => {
    const _fieldErrors = cloneDeep(fieldErrors);

    if (!error) {
      delete _fieldErrors[formControlName]
    } else {
      _fieldErrors[formControlName] = error
    }
    setFieldErrors(_fieldErrors)
    setForm((prev)=>({
      ...prev,
      [formControlName]: value
    }));
  };
  const onEditorSave = async () => {
    prop.onReload(true);
    try {
      await updateOneComment(
        {postId, commentId: prop.info.comment_id},
        {parent: prop.info.comment_id, access, content: form.content}
      );
    } catch(error) {
      setError(error)
    } finally {
      setForm(INIT_STATE);
      prop.onToggle(false);
      prop.onReload(false);
    }
  };

  const onEditorRely = async () => {
    prop.onReload(true);
    setLoading(true)
    // Send api
    try{
      await createOneComment(
        {postId},
        {parent: prop.info.comment_id, access, content: form.content}
      );
    } catch(error){
      setError(error)
    } finally {
      // Reset GUI
      setForm(cloneDeep(INIT_STATE));
      prop.onToggle(false);
      prop.onReload(false);
      setLoading(false)
    }
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

  const setError = (error)=>{
    prop.snackbarShowMessage(error.data.msg, 'error');
  }

  const onEditorCancel = () => {
    setForm(cloneDeep(INIT_STATE));
    prop.onToggle(false);
  };

  const onPrivateCheck = ()=>{
    const newValue = access === CommentAccess.Private? CommentAccess.Public: CommentAccess.Private
    setAccess(newValue)
  }

  useEffect(() => {
    if (prop.isPatch) {
      const blocksFromHTML = convertFromHTML(prop.info.content);
      const state = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
      // setEditorState(EditorState.createWithContent(state));
    }
  }, [prop.info]);

  return (
    <Row className="CommentEditor">
      <div className="avator"></div>
      <div className="body">
        <div className="content">
          <div className="cooked">
            <CustomToolbarEditor
              formControlName='content'
              value={''}
              name=""
              onChange={onInputChange}
              toolbar={{
                image: {
                  urlEnabled: true,
                  uploadEnabled: true,
                  uploadCallback: uploadImageCallBack,
                  inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                }
              }}></CustomToolbarEditor>
          </div>
          <div className='access'>
            <FormGroup>
              <FormControlLabel control={<Checkbox onChange={onPrivateCheck} />} label="Private message" />
            </FormGroup>
          </div>
          <section className="menu-area">
            <nav className="controls">
              <div className="actions">
                {prop.isPatch ? (
                  <ActionButton loading={loading} onClick={onEditorSave}>
                    Save
                  </ActionButton>
                ) : (
                  <ActionButton loading={loading} onClick={onEditorRely}>
                    Reply
                  </ActionButton>
                )}
                <ActionButton loading={loading} onClick={onEditorCancel}>
                  Cancel
                </ActionButton>
              </div>
            </nav>
          </section>
        </div>
      </div>
    </Row>
  );
};

export default withSnackbar(CommentEditor);
