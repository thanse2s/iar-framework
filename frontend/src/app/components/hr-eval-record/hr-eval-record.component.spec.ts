import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrEvalRecordComponent } from './hr-eval-record.component';

describe('HrEvalRecordComponent', () => {
  let component: HrEvalRecordComponent;
  let fixture: ComponentFixture<HrEvalRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrEvalRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HrEvalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
