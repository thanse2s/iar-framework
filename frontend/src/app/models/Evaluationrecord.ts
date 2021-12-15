import {Socialperformance} from './Socialperformance';
import {Orderevaluation} from './Orderevaluation';

export interface Evaluationrecord {
  year: number;
  employeeid: number;
  socialperformance: Socialperformance;
  orderevaluation: Orderevaluation;
}
