import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/api.model';

export function unwrapData<T>() {
  return map((res: ApiResponse<T>) => res.data);
}
