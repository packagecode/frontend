import { toast } from 'react-hot-toast';

export const showToast = (type: 'success' | 'error' | 'loading' | 'custom' = 'success', message: string) => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'error':
            toast.error(message);
            break;
        case 'loading':
            toast.loading(message);
            break;
        case 'custom':
        default:
            toast(message);
            break;
    }
};
