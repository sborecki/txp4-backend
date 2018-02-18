import { Document } from "mongoose";
import { IPerfPart } from "./perf-part-interface";

export interface IPerfPartModel extends IPerfPart, Document { }