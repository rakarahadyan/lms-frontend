// components/ConfirmationDialog.jsx
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const ConfirmationDialog = ({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onCancel,
  onConfirm,
  confirmText = "Yes",
  cancelText = "Cancel"
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCancel}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{description}</p>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={onCancel}
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md text-sm bg-red-600 text-white hover:bg-red-700"
                    style={{ backgroundColor: "red" }}
                    onClick={onConfirm}
                  >
                    {confirmText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationDialog;
