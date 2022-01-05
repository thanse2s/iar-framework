import {Socialperformance} from './Socialperformance';
import {Orderevaluation} from './Orderevaluation';

export interface Evaluationrecord {
  year: number;
  employee_id: number;
  is_committed: boolean;
  social_performance: Socialperformance[];
  orders_evaluation: Orderevaluation[];
}
