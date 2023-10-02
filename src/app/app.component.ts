import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { catchError, throwError } from 'rxjs';

class User {
  constructor(public id: Number,
    public Name: String,
    public Email: String,
    public Password: String) { };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'getPost';
  foundId = false;
  USER_DETAILS_ENDPOINT = "http://localhost:3000/userDetails" as const;

  registerForm = new FormGroup({
    Name: new FormControl(),
    Email: new FormControl(),
    Password: new FormControl()
  });

  updateForm = new FormGroup({
    id: new FormControl<Number | null>(null),
    Name: new FormControl<String>(''),
    Email: new FormControl<String>(''),
    Password: new FormControl<String>('')
  });

  constructor(private http: HttpClient) {
    console.log(this.getData());
  };

  getData() {
    this.http.get(this.USER_DETAILS_ENDPOINT).subscribe((res) => {
      console.log(res);
    });
  }

  handleFormSubmit() {
    this.http.post(this.USER_DETAILS_ENDPOINT, this.registerForm.value).subscribe((res) => {
      console.log("response got!", res);
    });
  }

  handleFormUpdate() {
    let id = this.updateForm.value.id;

    if (this.foundId) {
      this.http.put<User>(`${this.USER_DETAILS_ENDPOINT}/${id}`, this.updateForm.value)
        .subscribe((res) => {
          this.updateForm.setValue(res);
        });
    } else {
      this.http.get<User>(`${this.USER_DETAILS_ENDPOINT}/${id}`)
        .subscribe((res) => {
          if (res) {
            this.foundId = true;
            this.updateForm.setValue(res);
          }
        });
    }
  }
}
