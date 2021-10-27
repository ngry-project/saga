import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, Route, RouteReuseStrategy } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CachedRouteReuseStrategy implements RouteReuseStrategy {
  private readonly handles = new Map<Route | null, DetachedRouteHandle>();

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !this.handles.has(route.routeConfig);
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (handle) {
      this.handles.set(route.routeConfig, handle);
    } else {
      this.handles.delete(route.routeConfig);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.handles.has(route.routeConfig);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.handles.get(route.routeConfig) ?? null;
  }
}
