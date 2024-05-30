import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import * as events from "events";


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

  YOUR_PUBLISHABLE_KEY = 'pk_snd_43f71a16400840d09fe0df81b67da8f5';
  hyper: any;
  widgets: any;
  client:any;

  ngOnInit(): void {
    // Initialize HyperSwitch when the component is initialized
    this.loadHyperSwitch();
  }
  async loadHyperSwitch() {
    const response = await fetch('api/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: 'xl-tshirt' }], country: 'US' }),
    });
    const { clientSecret } = await response.json();
    this.client =  clientSecret;

    const appearance = {
      theme: 'midnight',
    };

    // Initialize HyperSwitch
    this.hyper = (window as any).Hyper(this.YOUR_PUBLISHABLE_KEY);
    this.widgets = this.hyper.widgets({ appearance, clientSecret });

    // Create payment checkout
    const unifiedCheckoutOptions = {
      wallets: {
        walletReturnUrl: 'https://example.com/complete',
      },
    };
    const unifiedCheckout = this.widgets.create('payment', unifiedCheckoutOptions);
    unifiedCheckout.mount('#unified-checkout');

    // await this.checkStatus();

    // Call handleSubmit and checkStatus

  }
  async handleSubmit(event: Event) {
    event.preventDefault();
    this.setLoading(true);
    await this.checkStatus();

    const { error } = await this.hyper.confirmPayment({
      widgets: this.widgets,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:4200/complete",
      },
    });

    // This point will only be reached if there is an immediate error occurring while confirming the payment. Otherwise, your customer will be redirected to your "return_url".

    // For some payment flows such as Sofort, iDEAL, your customer will be redirected to an intermediate page to complete authorization of the payment, and then redirected to the "return_url".

    if (error?.type === "validation_error") {
      this.showMessage(error.message);
    } else {
      this.showMessage("An unexpected error occurred.");
    }
    this.setLoading(false);
  }


  async checkStatus() {
    debugger
    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

    if (!clientSecret) {
      console.log("error status")
      return;
    }

    const { payment } = await this.hyper.retrievePayment(clientSecret);

    switch (payment.status) {
      case "succeeded":
        this.showMessage("Payment succeeded!");
        break;
      case "processing":
        this.showMessage("Your payment is processing.");
        break;
      case "requires_payment_method":
        this.showMessage("Your payment was not successful, please try again.");
        break;
      default:
        this.showMessage("Something went wrong.");
        break;
    }
  }

  showMessage(message: string) {
    // Implement your message display logic here
    console.log(message);
  }

  setLoading(isLoading: boolean) {
    // Implement your loading state logic here
    console.log(`Loading: ${isLoading}`);
  }


  initializes(): void {
    this.loadHyperSwitch();
  }


  protected readonly events = events;
}
