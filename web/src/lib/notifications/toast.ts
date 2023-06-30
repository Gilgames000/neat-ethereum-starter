import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

const AUTOHIDE_TIMEOUT = 3500;

function transactionToastSuccess(message?: string) {
    const t: ToastSettings = {
        message: message || 'Transaction successful',
        autohide: true,
        timeout: AUTOHIDE_TIMEOUT
    };

    toastStore.trigger(t);
}

function transactionToastError(message?: string) {
    const t: ToastSettings = {
        message: message || 'Transaction failed',
        autohide: true,
        timeout: AUTOHIDE_TIMEOUT
    };

    toastStore.trigger(t);
}

export { transactionToastSuccess, transactionToastError };
