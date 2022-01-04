import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitPageComponent } from './commit-page.component';

describe('ExamplePageComponent', () => {
  let component: CommitPageComponent;
  let fixture: ComponentFixture<CommitPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
