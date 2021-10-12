import { Component } from '@angular/core';

@Component({
  selector: 'ny-root',
  template: `
    <h2>Open SagaDevtools and click the button below</h2>
    <button routerLink="" [queryParams]="{ dialog: 'payment', amount: 123 }">Start Saga</button>
  `,
})
export class AppComponent {}
