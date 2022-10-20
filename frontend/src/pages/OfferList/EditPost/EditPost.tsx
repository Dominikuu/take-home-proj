import {useState, useEffect} from 'react';
import {cloneDeep, isEqual} from 'lodash';
import {Row, Col} from 'react-bootstrap';

import draftToHtml from 'draftjs-to-html';
import {styled} from '@mui/material/styles';
import withSnackbar from 'common/Snackbar/Snackbar';
import {Link, LoadingButton, Divider} from 'lib/mui-shared';
import {createOffer} from 'lib/offer/offer.action';
import {BlockEventType} from 'common/shared.definition';
import EventBus from 'eventing-bus';
import {useDispatch} from 'react-redux';
import {Dispatch} from 'redux';
import InputField from 'common/InputField/InputField';
import CustomToolbarEditor from 'common/CustomToolbarEditor/CustomToolbarEditor';
import './EditPost.scss';
import {INIT_STATE} from './EditPost.definition';

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
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [originForm, setOriginForm] = useState(cloneDeep(INIT_STATE.fields));
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch: Dispatch<any> = useDispatch();

  const [form, setForm] = useState(cloneDeep(INIT_STATE.fields));
  const [fieldErrors, setFieldErrors] = useState({});
  const {content} = form;

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
    const offer = cloneDeep(form);
    evt.preventDefault(); // prevents page from reloading on submit
    offer.content = draftToHtml(offer.content);
    dispatch(createOffer(offer));
    // if (this.validate()) return;

    prop.snackbarShowMessage('Saved successfully').then((onClosed) => {
      EventBus.publish(BlockEventType.ToggleDrawer, {isOpen: false});
    });
    setLoading(false);
  };
  const onResetClick = () => {
    setForm(cloneDeep(originForm));
    setIsFormChanged(false);
  };

  useEffect(() => {
    (async () => {
      setForm(cloneDeep(INIT_STATE.fields));
      setOriginForm(cloneDeep(INIT_STATE.fields));
      setLoading(false);
    })();
  }, []);

  return (
    <section className="EditPost">
      <Row>
        <Link
          className="link"
          underline="none"
          onClick={() => EventBus.publish(BlockEventType.ToggleDrawer, {isOpen: false})}
        >
          {'<< Back'}
        </Link>
      </Row>
      <h1>Create/Edit Topic</h1>
      <Divider />
      <form>
        <h2>Monetary compensation</h2>
        <Row>
          <Col>
            <InputField
              value={cloneDeep(form.jobTitle)}
              name="Job title"
              formControlName="jobTitle"
              placeholder=""
              type="text"
              required={true}
              onChange={onInputChange}
            ></InputField>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputField
              value={cloneDeep(form.salary)}
              name="Salary"
              formControlName="salary"
              placeholder=""
              type="number"
              required={true}
              onChange={onInputChange}
            ></InputField>
          </Col>
          <Col>
            <InputField
              value={cloneDeep(form.bonus)}
              name="Bonus"
              formControlName="bonus"
              placeholder=""
              type="number"
              required={true}
              onChange={onInputChange}
            ></InputField>
          </Col>
        </Row>
        <h2>non-monetary compensation</h2>
        <Row>
          <Col>
            <InputField
              value={cloneDeep(form.culture)}
              name="Culture"
              formControlName="culture"
              placeholder=""
              type="text"
              required={true}
              onChange={onInputChange}
            ></InputField>
          </Col>
          <Col>
            <InputField
              value={cloneDeep(form.learning)}
              name="learning"
              formControlName="learning"
              placeholder=""
              type="text"
              required={true}
              onChange={onInputChange}
            ></InputField>
          </Col>
        </Row>

        <Row>
          <CustomToolbarEditor
            formControlName="content"
            value={content}
            name="Description"
            onChange={onInputChange}
            toolbar={{}}
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
