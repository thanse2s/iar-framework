import {Socialperformance} from './Socialperformance';
import {Orderevaluation} from './Orderevaluation';

export class Evaluationrecord {
  constructor (
  public year: number,
  public employeeid: number,
  public socialperformance: Socialperformance[],
  public orderevaluation: Orderevaluation[]
  ) { }
}
