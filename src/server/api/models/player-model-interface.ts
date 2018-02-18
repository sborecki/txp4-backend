import { Document } from "mongoose";
import { IPlayer } from "./player-interface";

export interface IPlayerModel extends IPlayer, Document {}