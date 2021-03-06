import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'dtester-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() searchCriteria: EventEmitter<string> = new EventEmitter();
  search: FormControl = new FormControl();

  constructor(private router: Router) { }

  ngOnInit() {
    this.search.valueChanges.debounceTime(700).subscribe(val => this.searchCriteria.emit(val),
      err => this.router.navigate(['/bad_request']));
  }

}
