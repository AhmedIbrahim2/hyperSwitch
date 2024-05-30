import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {initialize} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";


@Component({
  selector: 'app-payement',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './payement.component.html',
  styleUrl: './payement.component.css'
})
export class PayementComponent  implements OnInit {

  YOUR_PUBLISHABLE_KEY = 'snd_K0MOodvCKL3koRK8f1zhFfrY4QEjGSuHGCeFv6goXm27nJke29lWWG4nxJnxdBq8';

  ngOnInit(): void {
    // Initialize HyperSwitch when the component is initialized
    this.loadHyperSwitch();
  }
  async loadHyperSwitch() {
    const response = await fetch('http://localhost:9090/api/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: 'xl-tshirt' }], country: 'US' }),
    });
    const { clientSecret } = await response.json();

    const appearance = {
      theme: 'midnight',
    };

    const hyper = (window as any).Hyper(this.YOUR_PUBLISHABLE_KEY);

    const widgets = hyper.widgets({ appearance, clientSecret });

    const unifiedCheckoutOptions = {
      wallets: {
        walletReturnUrl: 'https://example.com/complete',
      },
    };

    const unifiedCheckout = widgets.create('payment', unifiedCheckoutOptions);
    unifiedCheckout.mount('#unified-checkout');
  }

  initializes(): void {
    this.loadHyperSwitch();
  }

}
