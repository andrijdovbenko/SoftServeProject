import {Component, OnInit, ViewChild} from '@angular/core';
import { Subject } from './subject';
import { StatisticsService } from '../statistics/statistics.service';
import { GetRecordsRangeService } from '../services/get-records-range.service';
import { GetRecordsBySearchService } from '../services/get-records-by-search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFormComponent } from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import { GROUP_CONFIG } from '../universal/dynamic-form/config';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  subjects: Subject[] = [];
  headers: string[];
  displayPropertiesOrder: string[];
  numberOfRecords: number;
  recordsPerPage: number;
  page: number;
  btnClass: string = 'fa fa-calendar';

  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = GROUP_CONFIG;
  constructor(private statisticsService: StatisticsService,
              private getRecordsRangeService: GetRecordsRangeService,
              private getRecordsBySearchService: GetRecordsBySearchService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.page = 1;
    this.recordsPerPage = 5;
    this.getCountRecords();
    this.getSubjectsRange();
    this.headers = ['№', 'Назва предмету', 'Опис' ];
    this.displayPropertiesOrder = ['subject_name', 'subject_description'];
  }
  getSubjectsRange() {
    if (this.numberOfRecords <= (this.page - 1) * this.recordsPerPage) {
      --this.page;
    }
    this.getRecordsRangeService.getRecordsRange('subject', this.recordsPerPage, (this.page - 1) * this.recordsPerPage)
      .subscribe((data) => {
        this.subjects = data;
      });
  }
  getCountRecords() {
    this.statisticsService.getCountRecords('subject').subscribe((data) => {
      this.numberOfRecords = data.numberOfRecords;
    });
  }
  changePage(page: number) {
    this.page = page;
    this.getSubjectsRange();
  }
  changeNumberOfRecordsPerPage(newNumberOfRecordsPerPage: number) {
    this.recordsPerPage = newNumberOfRecordsPerPage;
    this.getSubjectsRange();
  }
  startSearch(criteria: string) {
    if (criteria === '') {
      this.getSubjectsRange();
      this.getCountRecords();
    } else {
      this.getRecordsBySearchService.getRecordsBySearch('subject', criteria).subscribe(resp => {
          if (resp['response'] === 'no records') {
            this.subjects = [];
            this.numberOfRecords = this.subjects.length;
          } else {
            this.numberOfRecords = 0;
            this.page = 2;
            this.subjects = resp;
          }
        },
        err => this.router.navigate(['/bad_request']));
    }
  }
  onTimeTableNavigate(subject: Subject) {
    this.router.navigate(['./timetable'], {queryParams: {'subject_id': subject.subject_id}, relativeTo: this.activatedRoute.parent});
  }
  onTestsNavigate(subject: Subject) {
    this.router.navigate(['./tests'], {queryParams: {'subject_id': subject.subject_id}, relativeTo: this.activatedRoute.parent});
  }

  // Method for opening editing and deleting common modal window

  add() {
    this.popup.sendItem(new Subject());
    this.popup.showModal();
  }

  edit(subject: Subject) {
    this.popup.sendItem(subject);
    this.popup.showModal();
  }

  del(subject: Subject) {
    this.popup.deleteEntity(subject);
  }
}
