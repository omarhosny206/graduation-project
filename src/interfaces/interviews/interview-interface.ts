import { Types } from "mongoose"
import { InterviewStatus } from "../../enums/interview-status-enum"
import IUser from "../users/user-interface"
import IInterviewInfo from "./interview-info-interface"

export default interface IInterview {
  _id: Types.ObjectId;
  interviewer: IUser;
  interviewee: IUser;
  status: InterviewStatus;
  isFinished: boolean;
  date: Date;
  info?: IInterviewInfo;
  price: number;
}