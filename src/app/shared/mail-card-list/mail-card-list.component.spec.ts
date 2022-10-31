import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailCardListComponent } from './mail-card-list.component';

describe('MailCardListComponent', () => {
  let component: MailCardListComponent;
  let fixture: ComponentFixture<MailCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailCardListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MailCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
