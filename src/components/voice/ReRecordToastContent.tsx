/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";

interface ReRecordToastContentProps {
  t: any;
  canUpload: boolean;
  onUpload?: () => void;
  onReRecord: () => void;
}

const ReRecordToastContent: React.FC<ReRecordToastContentProps> = ({
  t,
  canUpload,
  onUpload,
  onReRecord,
}) => {
  const handleReRecord = () => {
    onReRecord();
    toast.dismiss(t.id);
  };

  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } fixed top-4 right-50 z-50`}
    >
      <div className="flex flex-col space-y-4 p-4 bg-[#1a001a] border-2 border-pink-600 rounded-xl shadow-[0_0_20px_#ff00ff] text-pink-300 font-mono w-96 max-w-[90vw]">
        <span className="text-pink-400 text-sm text-center">
          ⚠️ You already have a recorded audio.
        </span>

        {canUpload ? (
          <>
            <span className="text-sm text-center">
              Do you want to upload the current recording or discard it and
              record again?
            </span>
            <div className="flex justify-around">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  onUpload?.();
                }}
                className="bg-green-500 text-black font-bold px-4 py-2 rounded hover:bg-green-400 transition duration-300 shadow-[0_0_10px_#00ff00]"
              >
                Upload
              </button>
              <button
                onClick={handleReRecord}
                className="bg-pink-600 text-black font-bold px-4 py-2 rounded hover:bg-pink-500 transition duration-300 shadow-[0_0_10px_#ff00ff]"
              >
                Re-record
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="text-sm text-center">
              Starting a new recording will delete the current one. Continue?
            </span>
            <div className="flex justify-center">
              <button
                onClick={handleReRecord}
                className="bg-pink-600 text-black font-bold px-4 py-2 rounded hover:bg-pink-500 transition duration-300 shadow-[0_0_10px_#ff00ff]"
              >
                Re-record
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReRecordToastContent;
