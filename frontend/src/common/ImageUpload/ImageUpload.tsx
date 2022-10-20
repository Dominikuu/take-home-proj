import React, {useState, useEffect} from 'react';
import {get, isString} from 'lodash'
import {CloudUploadIcon, CancelIcon, IconButton} from 'lib/mui-shared';
import {FormCtrlProps, Error} from 'common/shared.definition';
import './ImageUpload.scss';

interface ImageUploadProps<T> extends FormCtrlProps<T> {
  exclusive?: boolean;
  value: T;
  option?: {
    maxSize?: number,
    allowedType?: string[]
  }
}

const DEFAULT_ALLOWED_TYPE = ['image/jpeg', 'image/jpg', 'image/png'];
const DEAULT_MAX_SIZE = 4*1000*1000

const ERROR_WARNING = {
  allowed_type: 'The extension of uploaded image is not allowed. Only files in {0} can be uploaded',
  size: 'The image file upload size limit is {0}MB'
}

const ImageUpload: React.FC<ImageUploadProps<Blob| string>> = ({value, required, formControlName, name, onChange, validate, option}) => {
  const [state, setState] = useState<{value: Blob|string|null; error: boolean | Error}>({
    value,
    error: false
  });
  const [preview, setPreview] = useState<string>(value as string)

  useEffect(()=>{
    setPreview(value as string)
  }, [value])
  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!state.value || isString(state.value)) {
      return
    }

    const objectUrl = URL.createObjectURL(state.value as Blob)
    setPreview(objectUrl as string)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [state])

  const onSelectFile = e => {
      if (!e.target.files || e.target.files.length === 0) {
        setState({value: null, error: false})
        return
      }
      const newValue = e.target.files[0]
      const error: boolean| Error = onValidateImage(newValue);

      onChange && onChange({formControlName, value: newValue, error})
      setState({value: newValue, error})
  }

  const onValidateImage = (file: Blob): boolean|Error  => {
    const allowed_type = get(option,'allowed_type', DEFAULT_ALLOWED_TYPE)
    const max_size: number = get(option,'maxSize', DEAULT_MAX_SIZE)

    if (!isValidImageType(file.type, allowed_type)) {
      return {allowed_type: ERROR_WARNING['allowed_type'].replace('{0}', allowed_type)}
    }
    if (!isValidImageSize(file.size, max_size)) {
      return {size: ERROR_WARNING['size'].replace('{0}', (max_size/1000).toString())}
    }
    if (validate !== undefined) {
      return validate(file)
    }
    return false
  }

  const isValidImageType = (type: string, limit: string[]): boolean => {
    return type && limit.includes(type)? true: false
  }

  const isValidImageSize = (size: number, limit: number): boolean => {
    return size && size <= limit? true: false
  }

  const clearImage = ()=>{
    setPreview('')
    setState({value: null, error: false})
  }
  return (
    <div className="ImageUpload">
      <div className="label">{name}{required && (<span className="required">*</span>)}</div>
      {state && !state.value && !preview?
        <div className="uploader-wrapper">
          <label htmlFor="file-dropzone" className="image-dropzone" onClick={onSelectFile}>
            <span><CloudUploadIcon/></span>
            <span>Click to Upload</span>
          </label>
          <input id="file-dropzone" type='file' onChange={onSelectFile} accept="image/png, image/jpeg, image/jpg"/>
        </div>:
        <div className="image-wrapper">
          <div className="preview">
            <img className="uploaded-image" src={preview} alt="upload"/>
            <IconButton color="primary" className="clear-button" aria-label="upload picture" component="label" onClick={clearImage}>
              <CancelIcon />
            </IconButton>
          </div>
        </div>
      }
      {state.error?
        <div className="ui visible warning message">{Object.values(state.error)[0]}</div>
        : null
      }
    </div>
  );
};

export default ImageUpload;
