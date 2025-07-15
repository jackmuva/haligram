import { ToastContentProps } from "react-toastify";

export const Notification = ({ closeToast, data, isPaused, toastProps }: ToastContentProps) => {
  return (
    <div className="flex items-start justify-between w-full p-2">
      <p className="text-center">{data.message}</p>
      <button onClick={closeToast} className="hover:font-bold cursor-pointer">x</button>
    </div>
  );
}
