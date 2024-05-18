interface IProfileLabel {
  dataName: string;
  value: string;
}

const ProfileLabel = ({ dataName, value }: IProfileLabel) => {
  return (
    <div className="w-full flex flex-col">
      <p className="text-md text-slate-400">{dataName}</p>
      <p className="text-slate-100 text-md">{value}</p>
    </div>
  );
};

export default ProfileLabel;
