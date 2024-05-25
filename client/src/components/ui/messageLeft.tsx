

const MessageLeft = ({ message }: any) => {
  return (
    <p className="w-full h-fit">
      <span className="p-2 w-fit max-w-[50%] bg-slate-500 rounded-md float-start ">
        {message}
      </span>
    </p>
  );
};

export default MessageLeft;
