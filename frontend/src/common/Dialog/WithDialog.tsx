import React from 'react';
import {Subtract} from 'utility-types';
import {DialogPropTypes} from './type';
import DialogContext from 'common/Dialog/DialogContext';

const WithDialog = <Props extends DialogPropTypes>(
  Component: React.ComponentType<Props>
): React.ComponentType<Subtract<Props, DialogPropTypes>> => {
  return class C extends React.Component<Subtract<Props, DialogPropTypes>> {
    render() {
      return (
        <DialogContext.Consumer>
          {(context) => (
            <Component {...(this.props as Props)} openDialog={context.openDialog} closeDialog={context.closeDialog} />
          )}
        </DialogContext.Consumer>
      );
    }
  };
};

export default WithDialog;
