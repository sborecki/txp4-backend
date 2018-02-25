import { Document } from 'mongoose';
import { ISession } from './session-interface';

export interface ISessionModel extends ISession, Document { }
