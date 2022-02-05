import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleEvalRecordComponent } from './single-eval-record.component';

describe('SingleEvalRecordComponent', () => {
  let component: SingleEvalRecordComponent;
  let fixture: ComponentFixture<SingleEvalRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleEvalRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleEvalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
