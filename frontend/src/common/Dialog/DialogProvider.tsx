import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import dialogContext from './DialogContext';
import {DialogWidthType, DialogPropTypes, OpenDialogType, EmptyFunctionType} from './type';

interface StateTypes {
  value: DialogPropTypes;
  isOpen: boolean;
  title: string;
  okText?: string;
  cancelText?: string;
  width?: DialogWidthType;
  component: React.ReactNode;
  okCallback: EmptyFunctionType;
  cancelCallback?: EmptyFunctionType;
}

interface PropTypes {
  children: React.ReactNode;
}

class DialogProvider extends React.Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props);

    this.state = {
      isOpen: false,
      title: '',
      okText: 'Ok',
      cancelText: 'Cancel',
      width: 'md',
      component: null,
      okCallback: () => {
        console.log('Not implemented!');
      },
      cancelCallback: () => {
        console.log('Not implemented!');
      },
      value: {
        openDialog: this.open,
        closeDialog: this.close
      }
    };
  }

  public open: OpenDialogType = ({component, title, okCallback, cancelCallback, width, okText, cancelText}) => {
    this.setState({
      component,
      title,
      okCallback,
      cancelCallback,
      width,
      okText,
      cancelText,
      isOpen: true
    });
  };

  public close = (): void => {
    this.setState({isOpen: false});
  };

  public handleCloseClick = () => {
    if (this.state.cancelCallback) {
      this.state.cancelCallback();
    } else {
      this.close();
    }
  };

  render() {
    const {value, isOpen, width, title, okText, cancelText, component} = this.state;

    return (
      <dialogContext.Provider value={value}>
        <Dialog open={isOpen} onClose={this.handleCloseClick} maxWidth={width} fullWidth>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{component}</DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseClick} color="secondary">
              {cancelText}
            </Button>
            <Button onClick={this.state.okCallback} color="primary">
              {okText}
            </Button>
          </DialogActions>
        </Dialog>
        {this.props.children}
      </dialogContext.Provider>
    );
  }
}

export default DialogProvider;
