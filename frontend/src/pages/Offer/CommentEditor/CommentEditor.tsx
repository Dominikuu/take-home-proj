import {useEffect, useState} from 'react';
import {Row} from 'react-bootstrap';
import {cloneDeep} from 'lodash';
import {useParams} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {Dispatch} from 'redux';
import {styled} from '@mui/material/styles';
import {LoadingButton} from 'lib/mui-shared';
import CustomToolbarEditor from 'common/CustomToolbarEditor/CustomToolbarEditor';
import {convertFromHTML, ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import withSnackbar from 'common/Snackbar/Snackbar';
import {createComment} from 'lib/offer/offer.action';
import './CommentEditor.scss';
enum CommentAccess {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

const ActionButton = styled(LoadingButton)({
  background: '#fff',
  border: '1px solid #ff0000',
  borderRadius: '2rem',
  color: '#ff0000',
  padding: '0.25rem 0.5rem',
  'text-transform': 'inherit',
  '&:hover': {
    backgroundColor: '#ff0000',
    borderColor: '#ff0000',
    color: '#fff'
  }
});

const INIT_STATE = {content: ''};

const CommentEditor = (prop) => {
  const [loading, setLoading] = useState(false);
  const {offerId} = useParams<{offerId: string}>();
  const [access, setAccess] = useState<CommentAccess>(CommentAccess.Public);
  const [form, setForm] = useState(cloneDeep(INIT_STATE));
  const [fieldErrors, setFieldErrors] = useState({});
  const dispatch: Dispatch<any> = useDispatch();
  const onInputChange = ({formControlName, value, error}) => {
    const _fieldErrors = cloneDeep(fieldErrors);

    if (!error) {
      delete _fieldErrors[formControlName];
    } else {
      _fieldErrors[formControlName] = error;
    }
    setFieldErrors(_fieldErrors);
    setForm((prev) => ({
      ...prev,
      [formControlName]: value
    }));
  };
  const onEditorSave = async () => {
    prop.onReload(true);
    try {
      // await updateOneComment(
      //   {offerId, commentId: prop.info.comment_id},
      //   {parent: prop.info.comment_id, access, content: form.content}
      // );
    } catch (error) {
      setError(error);
    } finally {
      setForm(INIT_STATE);
      prop.onToggle(false);
      prop.onReload(false);
    }
  };

  const onEditorRely = async () => {
    prop.onReload(true);
    setLoading(true);
    // Send api

    // await createOneComment(
    //   {postId},
    //   {parent: prop.info.comment_id, access, content: form.content}
    // );
    dispatch(
      createComment(offerId as string, {parent: prop.info.comment_id, access, content: draftToHtml(form.content)})
    );

    // Reset GUI
    setForm(cloneDeep(INIT_STATE));
    prop.onToggle(false);
    prop.onReload(false);
    setLoading(false);
  };

  const setError = (error) => {
    prop.snackbarShowMessage(error.data.msg, 'error');
  };

  const onEditorCancel = () => {
    setForm(cloneDeep(INIT_STATE));
    prop.onToggle(false);
  };

  const onPrivateCheck = () => {
    const newValue = access === CommentAccess.Private ? CommentAccess.Public : CommentAccess.Private;
    setAccess(newValue);
  };

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
              formControlName="content"
              value={''}
              name=""
              onChange={onInputChange}
              toolbar={{}}
            ></CustomToolbarEditor>
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
