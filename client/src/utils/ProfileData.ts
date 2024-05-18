interface IProfileData {
  dataName: string;
  value: string;
}
const ProfileData: IProfileData[] = [
  {
    dataName: "Name",
    value: "John Doe",
  },
  {
    dataName: "Email",
    value: "adc@123.com",
  },
  {
    dataName: "Time",
    value: "11:40 AM",
  },
  {
    dataName: "Location",
    value: "california,USA",
  },
];
export default ProfileData