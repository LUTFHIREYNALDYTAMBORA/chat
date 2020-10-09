import React from 'react';
import mime from 'mime-types';
import { Modal, Input, Button, Icon, ModalHeader, ModalContent, ModalActions } from 'semantic-ui-react'

export default class FileModal extends React.Component {
    state = { 
        file: null,
        authorized: ['image/jpeg', 'image/png']
    }

    _handleAddFile = (e) => {
        const file = e.target.files[0];
        // console.log(file);
        if(file) {
            this.setState({ file });
        }
    }

    _handleSendFile = () => {
        const { file } = this.state;
        const { _handleUploadFile, _handleCloseModal } = this.props;
        if (file !== null) {
            if (this.isAuthorized(file.name)) {
                //send file
                const metadata = { contenType: mime.lookup(file.name) };
                _handleUploadFile(file, metadata);
                _handleCloseModal();
                this.clearFile();   
            }
        }
    }

    isAuthorized = filename => this.state.authorized.includes(mime.lookup(filename));

    clearFile = () => this.setState({ file: null });

    render() {
        const { modal, _handleCloseModal } = this.props;

        return (
            <Modal basic open={modal} onClose={_handleCloseModal} >
                <ModalHeader>Select an Image File</ModalHeader>
                    <ModalContent>
                        <Input
                            onChange={this._handleAddFile} 
                            fluid
                            label='File types: jpg, png'
                            name='file'
                            type='file'
                        />
                    </ModalContent>
                    <ModalActions>
                        <Button
                            onClick={this._handleSendFile}
                            color='green'
                            inverted
                        >
                            <Icon name='checkmark' />Send
                        </Button>
                        <Button
                            color='red'
                            inverted
                            onClick={_handleCloseModal}
                        >
                            <Icon name='remove' /> Cancel
                        </Button>
                    </ModalActions>
            </Modal>
        )
    }
}