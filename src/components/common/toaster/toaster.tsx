import React from 'react';
import Toast from 'react-bootstrap/Toast';
import {ToastContainer} from "react-bootstrap";

export interface ToastMessage {
    id: string;
    show: boolean;
    setShow: (show: boolean) => void;
    variant: string;
    message: string;
}

const ToastComponent: React.FC<ToastMessage> = ({ id, show, setShow, variant, message }) => {
    const handleClose = () => setShow(false);
    return (
        <div aria-live="polite" aria-atomic="true" className="position-relative">
            <ToastContainer  className="toast-container position-fixed top-0 end-0 p-3">
                <Toast id={id} className={`toast colored-toast bg-${variant}-transparent`} show={show} onClose={handleClose} delay={3000} autohide>
                    <Toast.Header className={`toast-header bg-${variant} text-fixed-white`}>
                        {/*<img className="bd-placeholder-img rounded me-2" src={toggledark} alt="..." />*/}
                        <strong className="me-auto">{variant}</strong>
                    </Toast.Header>
                    <Toast.Body>
                        {message}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default ToastComponent;
