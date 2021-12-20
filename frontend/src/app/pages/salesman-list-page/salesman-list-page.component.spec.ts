import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesmanListComponent } from './salesman-list-page.component';

describe('SalesmanListComponent', () =>
{
  let component: SalesmanListComponent;
  let fixture: ComponentFixture<SalesmanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesmanListComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
