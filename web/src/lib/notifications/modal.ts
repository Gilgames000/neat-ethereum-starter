import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';

function transactionModalSuccess(message: string) {
    const alert: ModalSettings = {
        type: 'alert',
        title: 'Transaction successfully submitted',
        body: message,
        buttonTextCancel: 'Close'
    };

    modalStore.trigger(alert);
}

function transactionModalError(message: string) {
    const alert: ModalSettings = {
        type: 'alert',
        title: 'Failed to submit transaction',
        body: message,
        buttonTextCancel: 'Close'
    };

    modalStore.trigger(alert);
}

export { transactionModalSuccess, transactionModalError };
