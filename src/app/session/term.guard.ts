import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TermService } from './term.service';

@Injectable({
  providedIn: 'root'
})
export class TermGuard implements CanActivate {
  private constructor(private termService: TermService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.termService.setCurrentTerm(route.paramMap.get('termId') as string);
      return true;
  }
  
}
