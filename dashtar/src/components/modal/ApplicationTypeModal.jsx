function ApplicationTypeModal({onClose, onSelect}) {
    return (
        <div className="fixed inset-0 z-40 flex w-auto items-center justify-center bg-black/60 backdrop-blur-sm">

            <div className=" bg-white rounded-2xl shadow-2xl p-6 text-center">

                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Select Application Type
                </h2>

                <p className="text-sm text-gray-500 mb-5">
                    Please choose your application category
                </p>

                <div className="flex gap-4 justify-center sm:flex-row flex-col">
                    <button
                        onClick={() => {
                            onSelect("UG");
                            onClose();
                        }}
                        className=" py-3  rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition px-3"
                    >
                        UG Application
                    </button>
                    <button
                        onClick={() => {
                            onSelect("PG");
                            onClose();
                        }}
                        className=" py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition px-3"
                    >
                        PG Application
                    </button>

                </div>

                <button
                    onClick={onClose}
                    className="mt-5 text-sm text-gray-400 hover:text-gray-600"
                >
                    Cancel
                </button>

            </div>
        </div>
    );
}

export default ApplicationTypeModal;