import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentComponent } from './document/document.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { RegisterComponent } from './register/register.component';
import { TermsComponent } from './terms/terms.component';
import { StateComponent } from './test/state/state.component';

let routes: Routes = [
  {
    path: '', 
    redirectTo: '/register',
    pathMatch: 'full'
  },
  {
    path :'register',
    component : RegisterComponent
  },
  {
    path: 'test',
    component: StateComponent
  },
  {
    path: 'terms',
    component: TermsComponent
  },
  {
    path: 'policy',
    component: PrivacypolicyComponent
  },
  {
    path: 'doc',
    component: DocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
