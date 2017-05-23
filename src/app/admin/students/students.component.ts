import { Component, OnInit } from '@angular/core';
import { StudentsService} from './students.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students = [];

  page = 1;                     /* current page */
  count: number;                /* count of all students */
  countPerPage = 5;             /* count of students per page */
  // headers: string[];            /* array of headers */
  editId = 0;                   /* id of edited speciality (if speciality is adding than 0 or undefined) */


  constructor(private studentsService: StudentsService, private router: Router) {
  }

  ngOnInit() {
    this.studentsService.getAllStudents().subscribe((data) => {
      this.students = data;
      console.log(this.students);
    });
    this.getStudents();       /* get specialities for start page and count of specialities for pagination */
    this.getCount();
  }
  getStudents(): void {
    /* if count of records less or equal than can contain current number of pages, than decrease page */
    if (this.count <= (this.page - 1) * this.countPerPage) {
      --this.page;
    }

    this.studentsService.getPaginated(this.countPerPage, (this.page - 1) * this.countPerPage)
      .subscribe(resp => this.students = resp, err => this.router.navigate(['/bad_request']));
  }

  getCount(): void {
    this.studentsService.getCount().subscribe(resp => this.count = resp,
      err => this.router.navigate(['/bad_request']));
  }
  changePage(page: number) {              /* callback method for change page pagination output event */
    this.page = page;
    this.getStudents();               /* request new specialilies for new page */
  }

  changeCountPerPage(itemsPerPage: number) {    /* callback method to set count entities per page when dropdown item had been selected */
    this.countPerPage = itemsPerPage;
    this.getStudents();
  }
}
