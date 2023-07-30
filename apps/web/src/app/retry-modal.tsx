import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
export enum ModalReason {
  initial,
  failed,
  passed,
}
export default function RetryModal(props: {
  resetFunction: (success: boolean) => void;
  onCloseModal: () => void;
  modalReason: ModalReason;
  isOpenModal: boolean;
}) {
  const cancelButtonRef = useRef(null);

  const buttonTextAction = {
    [ModalReason.failed]: {
      title: 'Mission failed',
      description:
        "Oh! Seems like you weren't careful enough. Wanna try\n" +
        '                          again?',
      buttonText: 'Try again',
      action: () => props.resetFunction(false),
    },
    [ModalReason.passed]: {
      title: 'Great job!',
      description:
        'Superwoman thrived with your support! Wanna start\n' +
        '                          again?',
      buttonText: 'Start a new cycle',
      action: () => props.resetFunction(true),
    },
    [ModalReason.initial]: {
      title: '',
      description: '',
      buttonText: '',
      action: () => props.onCloseModal(),
    },
  };
  return (
    <Transition.Root show={props.isOpenModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={props.onCloseModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10" />
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        {buttonTextAction[props.modalReason].title}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {buttonTextAction[props.modalReason].description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={buttonTextAction[props.modalReason].action}
                  >
                    {buttonTextAction[props.modalReason].buttonText}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={props.onCloseModal}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
