import React, { useEffect, useState, useRef } from 'react';
import {get} from 'lodash'
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/alignment/lib/plugin.css'

import Editor, { createEditorStateWithText, composeDecorators } from '@draft-js-plugins/editor';
import { convertToRaw, CompositeDecorator, EditorState, convertFromHTML, AtomicBlockUtils, ContentState } from 'draft-js';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from '@draft-js-plugins/buttons';
import {Error, FormCtrlProps} from 'common/shared.definition';
import createImagePlugin from '@draft-js-plugins/image';
import createAlignmentPlugin from '@draft-js-plugins/alignment';
import createFocusPlugin from '@draft-js-plugins/focus';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createDragNDropUploadPlugin from '@draft-js-plugins/drag-n-drop-upload';
import createResizableBlockPlugin from './ReizableBlockPlugin'
import {Box, InputLabel} from 'lib/mui-shared'
import HeadlinesButton from './HeadlinesButton/HeadlinesButton'
import ImageButton from './ImageButton/ImageButton'
import './CustomToolbarEditor.scss'
import { readFile } from '@draft-js-plugins/drag-n-drop-upload';


interface EditorProps<T> extends FormCtrlProps<T> {
  exclusive?: boolean;
  value: T;
  toolbar: {
    image?: {
      urlEnabled: boolean;
      uploadEnabled: boolean;
      uploadCallback: (file: any) => Promise<{
        data: {
            link: any;
        };
      }>;
      inputAccept: string;
    }
  }
}

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin({
  vertical: 'relative',
  horizontal: 'relative',
});
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();

const { AlignmentTool } = alignmentPlugin;
const imageDecorator = composeDecorators(
  focusPlugin.decorator,
  resizeablePlugin.decorator,
);

const resizableBlockPlugin = createResizableBlockPlugin({ decorator: imageDecorator });
const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);
function mockUpload(data, success, failed, progress) {
  function doProgress(percent?) {
    progress(percent || 1);
    if (percent === 100) {
      // Start reading the file
      Promise.all(data.files.map(readFile)).then((files) =>
        success(files, { retainSrc: true })
      );
    } else {
      setTimeout(doProgress, 250, (percent || 0) + 10);
    }
  }

  doProgress();
  return ''
}
const imagePlugin = createImagePlugin({ decorator });
const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
  handleUpload: mockUpload,
  addImage: (editorState, src) => imagePlugin.addImage(editorState, src as string, {})

});

const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const plugins = [
  staticToolbarPlugin,
  dragNDropFileUploadPlugin,
  blockDndPlugin,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin,
  // TODO:
  resizableBlockPlugin
];

const CustomToolbarEditor: React.FC<EditorProps<string>> = ({onChange, formControlName, value, name, required, toolbar})=>{
  const [editorState, setEditorState] = useState( createEditorStateWithText(''))
  const [error, setError] = useState<boolean | Error>(false)

  const onEditorChange = (_editorState: EditorState) => {
    setEditorState(_editorState)
    // REMIND: Could not use getCurrentContent
    EditorState.createWithContent(_editorState.getCurrentContent());
    const result = convertToRaw(_editorState.getCurrentContent())
    // Append '%' to Image width and height
    for(const key of Object.keys(result.entityMap)){
      const type = result.entityMap[key].type
      if (type === 'IMAGE') {
        const data = result.entityMap[key].data
        console.log(data.width, data.height)
        data.width = typeof data.width == 'string'? data.width: data.width+'%'
        data.height = typeof data.height == 'string'? data.height: data.height+'%'
      }
    }
    onChange&&onChange({
      formControlName,
      value:result,
      error: false
    })
  };

  const editorRef = useRef<Editor>(null);
  const focus = (): void => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const insertImage = (src: string) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "IMAGE",
      "IMMUTABLE",
      { src, height: 100, width: 100}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });

    onEditorChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "))
  };

  const customContentStateConverter = (contentState) => {
    // changes block type of images to 'atomic'
    const newBlockMap = contentState.getBlockMap().map((block) => {
        const entityKey = block.getEntityAt(0);
        if (entityKey !== null) {
            const entityBlock = contentState.getEntity(entityKey);
            const entityType = entityBlock.getType();
            const entityData = entityBlock.getData();
            switch (entityType) {
              case 'IMAGE': {
                const sizeUnit = (val) => val && val !== 'undefined'? val: 0
                const width = sizeUnit(entityData.width)
                const height = sizeUnit(entityData.height)
                console.log(entityData.style)
                  const newBlock = block.merge({
                    type: 'atomic',
                    text: 'img',
                    data: {...entityData, width, height, style: `width: ${width}; height: ${height}`}
                  });
                  Object.assign(entityData, {width, height, style: `width: ${width}; height: ${height}`})
                  // entityBlock.data ={...entityData, width, height, style: `width: ${width}; height: ${height}`}
                  console.log(block, entityBlock.getData())
                  return newBlock;
                }
                default:
                    return block;
            }
        }
        return block;
      });
      console.log(contentState.getEntityMap(), contentState.getBlockMap())

    const newContentState = contentState.set('blockMap', newBlockMap);
    return newContentState;
  }

  function findImageEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'IMAGE'
        );
      },
      callback
    );
  }

  // const Image = (props) => {
  //   const {
  //     height,
  //     src,
  //     width,
  //   } = props.contentState.getEntity(props.entityKey).getData();
  //   return (
  //     <img src={src} height={height} width={width} />
  //   );
  // };
  // const _decorator = new CompositeDecorator([
  //   {
  //     strategy: findImageEntities,
  //     component: Image,
  //   },
  // ])

  const setInitEditorContent = ()=>{
    if (typeof value !== 'string'){
      return
    }
    const blocksFromHTML = convertFromHTML(value);
    const createWithContent = EditorState.createWithContent(customContentStateConverter(
      ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
    ))
    // const createWithContent = EditorState.createWithContent(
    //   ContentState.createFromBlockArray(
    //       blocksFromHTML.contentBlocks,
    //       blocksFromHTML.entityMap

    // ))
    console.log(createWithContent)

    setEditorState(createWithContent)
  }

  useEffect(()=>{
    setInitEditorContent()
    setError(error)
  }, [value])

  return (
    <Box className="field" onClick={focus}>
      <InputLabel sx={{color: '#212529'}} className="label">{name}{required && (<span className="required">*</span>)}</InputLabel>
      <Box className='editor' sx={{marginLeft: 0, marginRight: 0}} >
        <Toolbar>
          {
            // may be use React.Fragment instead of div to improve perfomance after React 16
            (externalProps) =>  (
              <div>
                <BoldButton {...externalProps}/>
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <CodeButton {...externalProps} />
                {/* <Separator {...externalProps} /> */}
                <HeadlinesButton {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <CodeBlockButton {...externalProps} />
                <ImageButton {...externalProps} option={{...get(toolbar, 'image'), insertImageCallback: insertImage}}/>
              </div>
            )
          }
        </Toolbar>
        <Editor
          editorState={editorState}
          onChange={onEditorChange}
          plugins={plugins}
          ref={editorRef}

        />
        <AlignmentTool />
      </Box>
      {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
    </Box>
  );
}

export default CustomToolbarEditor
