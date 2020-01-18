import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { NgxSpinnerService } from "ngx-spinner";
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient
    ) {}

    ip: string;
    quote: any;
    loaded: boolean;
    // baseUrl = 'http://localhost:3000/api'
    baseUrl = 'http://quotes-node-api-postgres.herokuapp.com/api'
    separateDialCode = true;
    SearchCountryField = SearchCountryField;
    TooltipLabel = TooltipLabel;
    CountryISO = CountryISO;
    phoneForm = new FormGroup({
      phone: new FormControl(undefined, [Validators.required])
    });

    httpOptions = {
      headers: new HttpHeaders({
        'x-rapidapi-host': 'ajith-messages.p.rapidapi.com',
        'x-rapidapi-key': '8c7e7cdcdemsh88c0d60f32904b3p15d613jsn559029987163'
      })
    }

    addPhoneNumber (phoneNumber) {
      var data = {
        phone_number: phoneNumber,
        ip: this.ip
      };

      return this.http.post(this.baseUrl + '/phone', data).toPromise();
    }

    onSubmit (form) {
      this.spinner.show();
      var phoneNumber = form.value.phone.internationalNumber;
      var error = form.controls.phone.errors;
      if (error) {
        this.spinner.hide();
        console.log('throw some error');
      } else {
       this.addPhoneNumber(phoneNumber).then(res => {
          this.spinner.hide();
          var userPhoneNumber = localStorage.getItem('user');
          if (userPhoneNumber == null) {
            localStorage.setItem('user', JSON.stringify(phoneNumber));
            // old API
            // window.location.href = 'https://api.whatsapp.com/send?phone=' + phoneNumber;
            var message = 'hey, this is your personal space. You can draft messages, make to-do lists or keep links and files to hand. You can also talk to yourself here, but please bear in mind you’ll have to provide both sides of the conversation :-p';
            window.location.href = 'https://wa.me/' + phoneNumber + '?text=' + message;
          } else {
            window.location.href = 'https://wa.me/' + phoneNumber;
          }
        });
      }
    }

    findIP () {
      return this.http.get('https://ipinfo.io/?token=6a04d23c6cce11').toPromise().then(data => {
        this.ip = Object(data).ip;
        var ip = {
          ip: this.ip,
          city: Object(data).city,
          region: Object(data).region,
          country: Object(data).country,
          loc: Object(data).loc,
          org: Object(data).org,
          postal: Object(data).postal,
          timezone: Object(data).timezone,
          visited: new Date().toLocaleString()
        };

        return this.http.post(this.baseUrl + '/ip', ip).toPromise();
      });
    }

    findQuotes () {
      // return this.http.get('https://ajith-messages.p.rapidapi.com/getMsgs?category=love', this.httpOptions).toPromise().then(res => {
      //   this.quote = Object(res).Message;
      // });
      var offset = Math.floor((Math.random() * 2000) + 1);
      this.loaded = false;

      return this.http.get(this.baseUrl + '/test?offset=' + offset).toPromise().then(res => {      
        this.quote = JSON.stringify(res[0].content.Quote);
        this.loaded = true;
        //this.quote = JSON.stringify(res);
        //this.quote = Object(res);
      })
    }

    forwardQuote () {
      if (this.quote !== null) {
        window.location.href = 'https://wa.me/?text=' + this.quote;
      }
    }

    getQuote () {
      var a = localStorage.getItem('quote');
    }

    ngOnInit () {
      this.findIP();
      this.findQuotes();
    }
}
