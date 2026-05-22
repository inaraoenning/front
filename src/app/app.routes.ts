import { Routes } from '@angular/router';
import { BlankComponent } from './screens/blank.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'blank',
    pathMatch: 'full',
  },
  {
    path: 'blank',
    component: BlankComponent,
  },
];
