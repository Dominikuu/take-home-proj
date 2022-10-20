import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {cloneDeep, isEqual} from 'lodash';
import {useParams, useNavigate} from 'react-router-dom';
import {Row} from 'react-bootstrap';

import draftToHtml from 'draftjs-to-html';
import {styled} from '@mui/material/styles';
import ImageUpload from 'common/ImageUpload/ImageUpload';
import {Link, LoadingButton} from 'lib/mui-shared';
import withSnackbar from 'common/Snackbar/Snackbar';

import InputField from 'common/InputField/InputField';
import Swtich from 'common/Switch/Switch';
import ToggleButtonGroup from 'common/ToggleButtonGroup/ToggleButtonGroup';
import CustomToolbarEditor from 'common/CustomToolbarEditor/CustomToolbarEditor';
import {Category} from 'common/shared.definition';
import {updateOnePost, getOnePost} from 'api/post';
import {createPostImage} from 'api/post/image/upload';
import {Role} from 'App';
import './Edit-post.scss';
import {CATEGORY_OPTIONS, TAG_OPTIONS, INIT_STATE} from './Edit-post.definition';

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
  },

  ':disabled': {
    border: '#ebebeb'
  }
});

const EditPost = (prop) => {
  const {postId} = useParams<{postId: string}>() as {postId: string};
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [originForm, setOriginForm] = useState(cloneDeep(INIT_STATE.fields));
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [form, setForm] = useState(cloneDeep(INIT_STATE.fields));
  const [fieldErrors, setFieldErrors] = useState({});
  const {content} = form;
  const authState = useSelector((state: {auth: any}) => state.auth);
  const history = useNavigate();

  const onInputChange = ({formControlName, value, error}) => {
    const _fieldErrors = cloneDeep(fieldErrors);

    if (!error) {
      delete _fieldErrors[formControlName];
    } else {
      _fieldErrors[formControlName] = error;
    }
    setFieldErrors(_fieldErrors);
    setIsFormChanged(!isEqual({...form, [formControlName]: value}, originForm));
    setForm((prev) => ({
      ...prev,
      [formControlName]: value
    }));
  };

  const customEntityTransform = (entity, text) => {
    if (entity.type !== 'IMAGE') return;
    // eslint-disable-next-line consistent-return

    var alignment = entity.data.alignment;

    if (alignment && alignment.length) {
      return '<div style="text-align:'
        .concat(alignment, ';"><img src="')
        .concat(entity.data.src, '" alt="')
        .concat(entity.data.alt, '" height="')
        .concat(entity.data.height, '" width="')
        .concat(entity.data.width, '" style="height: ')
        .concat(entity.data.height, ';width: ')
        .concat(entity.data.width, '"/></div>');
    }

    return '<img src="'
      .concat(entity.data.src, '" alt="')
      .concat(entity.data.alt, '" height="')
      .concat(entity.data.height, '" width="')
      .concat(entity.data.width, '" style="height: ')
      .concat(entity.data.height, ';width: ')
      .concat(entity.data.width, '"/>');
  };

  const onFormSubmit = async (evt) => {
    setLoading(true);
    const post = cloneDeep(form);
    evt.preventDefault(); // prevents page from reloading on submit
    // if (this.validate()) return;
    const formData = new FormData();
    for (let [formctrl, value] of Object.entries(post)) {
      if (formctrl === 'content' && typeof value !== 'string') {
        value = draftToHtml(value, {}, false, customEntityTransform);
      }
      formData.append(formctrl, value as string);
    }
    try {
      const {data} = await updateOnePost(postId, formData);
      prop.snackbarShowMessage('Saved successfully').then((onClosed) => {
        if (data) {
          history(`/post/${postId}`);
        }
      });
    } catch (err) {
      prop.snackbarShowMessage('Error:' + err, 'alert');
      setLoading(false);
    }
  };
  const onResetClick = () => {
    setForm(cloneDeep(originForm));
    setIsFormChanged(false);
  };

  const uploadImageCallBack = async (file) => {
    const existedImages = cloneDeep(uploadedImages);
    const formData = new FormData();
    formData.append('files', file);
    const imgUrl = await createPostImage(formData);
    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file)
    };

    existedImages.push(imageObject);
    setUploadedImages(existedImages);
    return Promise.resolve({data: {link: imgUrl.data}});
  };

  useEffect(() => {
    (async () => {
      const {
        data: {category, content, tags, title, is_pinned, cover}
      } = await getOnePost(postId);
      const originForm = {title, content, tags, category, is_pinned, cover};
      setForm(cloneDeep(originForm));
      setOriginForm(cloneDeep(originForm));
      setLoading(false);
    })();
  }, []);

  return (
    <section className="EditPost">
      <Row>
        <Link className="link" href="#" underline="none">
          {'<< Back'}
        </Link>
      </Row>
      <h4>Edit Topic</h4>
      <form>
        <Row>
          <InputField
            value={cloneDeep(form.title)}
            name="Title"
            formControlName="title"
            placeholder=""
            type="text"
            required={true}
            onChange={onInputChange}
          ></InputField>
        </Row>
        <Row>
          <Swtich
            value={cloneDeep(form.is_pinned)}
            name="Pinned"
            formControlName="is_pinned"
            onChange={onInputChange}
          ></Swtich>
        </Row>
        {authState.user && authState.user.role === Role.Admin ? (
          <>
            <Row>
              <Swtich
                value={cloneDeep(form.closed)}
                name="Stop comment"
                formControlName="closed"
                onChange={onInputChange}
              ></Swtich>
            </Row>
            <Row>
              <Swtich
                value={cloneDeep(form.hidden)}
                name="Hide"
                formControlName="hidden"
                onChange={onInputChange}
              ></Swtich>
            </Row>
          </>
        ) : null}
        <Row>
          <ToggleButtonGroup
            value={cloneDeep(form.category)}
            name="Category"
            placeholder=""
            formControlName="category"
            type="text"
            exclusive={true}
            options={CATEGORY_OPTIONS}
            onChange={onInputChange}
          ></ToggleButtonGroup>
        </Row>
        <Row>
          <ToggleButtonGroup
            value={cloneDeep(form.tags)}
            name="Tag"
            formControlName="tags"
            placeholder=""
            type="text"
            options={TAG_OPTIONS}
            onChange={onInputChange}
          ></ToggleButtonGroup>
        </Row>
        {form.category === Category.Announcement ? (
          <Row>
            <ImageUpload
              value={cloneDeep(form.cover)}
              name="Cover"
              formControlName="cover"
              onChange={onInputChange}
            ></ImageUpload>
          </Row>
        ) : null}
        <Row>
          <CustomToolbarEditor
            formControlName="content"
            value={content}
            name="Description"
            onChange={onInputChange}
            toolbar={{
              image: {
                urlEnabled: true,
                uploadEnabled: true,
                uploadCallback: uploadImageCallBack,
                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'
              }
            }}
          ></CustomToolbarEditor>
        </Row>
        <Row className="btn-container">
          <ActionButton
            className="btn btn-primary centerButton"
            loading={loading}
            onClick={onFormSubmit}
            variant="contained"
            disabled={!isFormChanged || Object.keys(fieldErrors).length !== 0}
          >
            Update
          </ActionButton>
          <ActionButton
            className="btn btn-primary centerButton"
            loading={loading}
            onClick={onResetClick}
            variant="contained"
            disabled={!isFormChanged}
          >
            Cancel
          </ActionButton>
        </Row>
      </form>
      <div></div>
    </section>
  );
};

export default withSnackbar(EditPost);
