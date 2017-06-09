import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentsService } from '../students/students.service';
import { Student } from '../students/student';
import { Result } from '../results/result';
import { ResultsService } from '../services/results.service';
import { Group } from '../group/group';
import { GroupService } from '../group/group.service';
import { Question } from './question';
import { QuestionsService } from '../services/questions.service';
import { AnswersService } from '../services/answers.service';
import { Answer } from './answer';
import { TestsService } from '../services/tests.service';
import { Test } from '../tests/test';
import { TestDetailService } from '../test-detail/test-detail.service';
import { TestDetail } from '../test-detail/testDetail';

@Component({
  selector: 'dtester-detailed',
  templateUrl: './detailed.component.html',
  styleUrls: ['./detailed.component.css']
})
export class DetailedComponent implements OnInit {

  NO_RECORDS = 'no records';

  studentId: number;
  student: Student;
  results: Result[];
  group: Group;
  tests: Test[] = [];
  active_id = 0;
  percents: string[] = [];

  constructor(private activatedRoute: ActivatedRoute, private studentService: StudentsService,
              private resultService: ResultsService, private groupService: GroupService,
              private questionsService: QuestionsService, private answersService: AnswersService,
              private testsService: TestsService, private testDetailsService: TestDetailService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.studentId = params['studentId'];
      this.getResultsByStudentId(this.studentId);
    });
  }

  getStudentById(id: number) {
    this.studentService.getStudentById(id).subscribe((resp: Student) => {
      if (resp['response'] === this.NO_RECORDS) {    /* check condition: if no records presented for search criteria */
        this.student = null;
      } else {
        this.student = resp[0];
        this.getGroupByStudent(this.student.group_id);
      }
    });
  }

  getResultsByStudentId(id: number) {
    this.getStudentById(id);
    this.resultService.getAllByStudent(id).subscribe((resp: Result[]) => {
      if (resp['response'] === this.NO_RECORDS) {    /* check condition: if no records presented for search criteria */
        this.results = [];
      } else {
        resp.forEach((res: Result) => {
          const strQ = JSON.parse((res.questions).toString().replace(new RegExp('&quot;', 'g'), '\"'));
          const quest: Question[] = [];
          for (let i = 0; i < strQ.length; i++) {
            let question: Question;
            const answers: Answer[] = [];

            for (let j = 0; j < strQ[i].answers.length; j++) {
              this.answersService.getAnswersById(strQ[i].answers[j]).subscribe((a: Answer) => answers.push(a[0]));
            }
            this.questionsService.getQuestionById(strQ[i].question_id).subscribe((q: Question) => {
              question = q[0];
              question['answers'] = answers;
              quest.push(question);
            });
          }
          res['questions'] = quest;
        });
        this.results = resp;
        for (const result of resp) {
          this.testsService.getTestById(result.test_id).subscribe((response: Test) => this.tests.push(response[0]));
          this.testDetailsService.getTestDetails(result.test_id).subscribe((tDetails: TestDetail[]) => {
            let sum = 0;
            for (const tDetail of tDetails) {
              sum += +tDetail.rate * tDetail.tasks;
            }
            this.percents.push((result.result * 100 / sum).toFixed(2));
          });
        }
      }
    });
  }

  getGroupByStudent(id: number) {
    this.groupService.getGroupById(id).subscribe((resp: Group) => this.group = resp[0]);
  }

  setActive(i: number) {
    this.active_id = i;
  }

  calcutateTimeInterval(start: string, end: string): string {
    function parseStringIntoDate(s: string): Date {
      const splitS = s.split(':');
      const d: Date = new Date();
      d.setHours(+splitS[0]);
      d.setMinutes(+splitS[1]);
      d.setSeconds(+splitS[2]);
      return d;
    }

    const s: Date = parseStringIntoDate(start);
    const e: Date = parseStringIntoDate(end);
    let interval: number = (e.getTime() - s.getTime()) / 1000;
    const seconds = Math.floor(interval % 60) ? `${Math.floor(interval % 60)} сек` : '';
    interval /= 60;
    const minutes = Math.floor(interval % 60) ? `${Math.floor(interval % 60)} хв` : '';
    interval /= 60;
    const hours = Math.floor(interval / 24) ? `${Math.floor(interval / 24)} год` : '';
    return `${hours} ${minutes} ${seconds}`;
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Результати тестування</title>
          <style>
          @media print {  
            .hidden-print   { display: none !important; }
          }
          </style>          
        </head>
    <body onload="window.print();window.close()">
      <h3>Студент ${this.student['student_surname'] + ' ' + this.student['student_name'] + ' ' + this.student['student_fname']}</h3>
          ${printContents}
    </body>
      </html>`
    );
    popupWin.document.close();
  }
}
