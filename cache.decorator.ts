import { Observable, race, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface CacheOptions {
  apiId?: string; // to avoid duplicate methods
  ttl?: number; // time to clear the cache,
}

export function Cache(options?: CacheOptions) {
  return (target: any, propertyKey: string, descriptor) => {
    const originalFunction = descriptor?.value;
    const apiUniqueId = options?.apiId || propertyKey;

    if (options?.ttl) {
      target[`${apiUniqueId}_cached`] = new ReplaySubject(1, options?.ttl);
    } else {
      target[`${apiUniqueId}_cached`] = new ReplaySubject(1);
    }

    descriptor.value = function (...args) {
      const req: Observable<any> = originalFunction.apply(this, args).pipe(
        tap((response) => {
          this[`${apiUniqueId}_cached`].next(response);
        })
      );

      return race(this[`${apiUniqueId}_cached`], req);
    };

    return descriptor;
  };
}
