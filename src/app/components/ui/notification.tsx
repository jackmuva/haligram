import { ToastContentProps } from "react-toastify";

export const Notification = ({ closeToast, data, isPaused, toastProps }: ToastContentProps) => {
  return (
    <div className="relative flex items-start justify-between w-full p-2">
      <p className="text-center">{data.message}</p>
      <button onClick={closeToast} className="hover:font-bold cursor-pointer absolute top-0 right-0">x</button>
    </div>
  );
}
