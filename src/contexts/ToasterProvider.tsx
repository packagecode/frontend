import React, { createContext, useState, ReactNode, useContext } from 'react';
import ToastComponent, { ToastMessage } from '../components/common/toaster/toaster.tsx';

interface ToasterContextType {
    showToast: (id: string, variant: string, message: string) => void;
    hideToast: (id: string) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

interface ToasterProviderProps {
    children: ReactNode;
}

export const ToasterProvider: React.FC<ToasterProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = (id: string, variant: string, message: string) => {
        setToasts(prevToasts => [
            ...prevToasts,
            { id, variant, message, show: true, setShow: () => {} }
        ]);
    };

    const hideToast = (id: string) => {
        setToasts(prevToasts =>
            prevToasts.map(toast =>
                toast.id === id ? { ...toast, show: false } : toast
            )
        );
    };
    console.log(toasts);
    return (
        <ToasterContext.Provider value={{ showToast, hideToast }}>
            {children}
            {toasts.map((toast, key) => (
                <ToastComponent
                    key={key}
                    id={toast.id}
                    show={toast.show}
                    setShow={() => hideToast(toast.id)}
                    variant={toast.variant}
                    message={toast.message}
                />
            ))}
        </ToasterContext.Provider>
    );
};

export const useToaster = () => {
    const context = useContext(ToasterContext);
    if (!context) {
        throw new Error('useToaster must be used within a ToasterProvider');
    }
    return context;
};
