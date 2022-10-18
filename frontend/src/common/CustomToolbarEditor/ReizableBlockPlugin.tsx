import React, {ForwardedRef} from 'react';

// FIXME:
interface ColorBlockProp {
  block: (block: any) => void
  blockProps: any
  customStyleMap: any
  customStyleFn: any
  decorator: any
  forceSelection: any
  offsetKey: any
  selection: any
  tree: any
  contentState: any
  blockStyleFn: any
  preventScroll: any
  style: any

}
const ColorBlock = React.forwardRef(
  (
    {
      block, // eslint-disable-line no-unused-vars
      blockProps, // eslint-disable-line no-unused-vars
      customStyleMap, // eslint-disable-line no-unused-vars
      customStyleFn, // eslint-disable-line no-unused-vars
      decorator, // eslint-disable-line no-unused-vars
      forceSelection, // eslint-disable-line no-unused-vars
      offsetKey, // eslint-disable-line no-unused-vars
      selection, // eslint-disable-line no-unused-vars
      tree, // eslint-disable-line no-unused-vars
      contentState, // eslint-disable-line no-unused-vars
      blockStyleFn, // eslint-disable-line no-unused-vars
      preventScroll, // eslint-disable-line no-unused-vars
      style,
      ...elementProps
    }:ColorBlockProp,
    ref:ForwardedRef<HTMLImageElement>
  ) => {
    console.log(blockProps, style, block)
    // console.log(block.getData())
    const {src, alt, width, height} = blockProps.resizeData
    console.log(src, alt, width,
      height)
    const _width = typeof width === 'string'? width: width+'%'
    const _height = typeof height === 'string'? height : height+'%'
    return (
    <img
      src={src}
      alt={alt}
      ref={ref}
      {...elementProps}
      style={{...style, height: _height, width: _width}}
    />
  )}
);

const createResizableBlockPlugin = (config = {decorator: (block)=>{}}) => {
  const component = config.decorator
    ? config.decorator(ColorBlock)
    : ColorBlock;
  return {
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === 'atomic') {

        const contentState = getEditorState().getCurrentContent();
        const entity = contentState.getEntity(block.getEntityAt(0));
        const type = entity.getType();
        if (type === 'IMAGE') {
          console.log(type, entity.getData())
          return {
            component,
            editable: false,
          };
        }
      }
      return null;
    },
  };
};
ColorBlock.displayName = 'ColorBlock';

export default createResizableBlockPlugin;
