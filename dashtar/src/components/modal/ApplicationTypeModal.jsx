function ApplicationTypeModal({ onClose, onSelect }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-2xl shadow-2xl p-8 md:p-10 text-center">

        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          Select Application Type
        </h2>

        <p className="text-gray-500 text-sm md:text-base mb-6">
          Please choose the type of application you want to proceed with.
        </p>

        <div className="flex gap-4 justify-center sm:flex-row flex-col">

          <button
            onClick={() => {
              onSelect("UG");
              onClose();
            }}
            className="py-4 px-6 rounded-xl bg-blue-500 text-white text-base font-semibold hover:bg-blue-600 transition w-full sm:w-auto"
          >
            UG Application
          </button>

          <button
            onClick={() => {
              onSelect("PG");
              onClose();
            }}
            className="py-4 px-6 rounded-xl bg-green-500 text-white text-base font-semibold hover:bg-green-600 transition w-full sm:w-auto"
          >
            PG Application
          </button>

        </div>

        <button
          onClick={onClose}
          className="mt-6  text-gray-800 font-bold text-lg hover:text-gray-600"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}

export default ApplicationTypeModal;