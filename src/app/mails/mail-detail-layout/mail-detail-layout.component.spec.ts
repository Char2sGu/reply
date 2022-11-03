import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailDetailLayoutComponent } from './mail-detail-layout.component';

describe('MailDetailLayoutComponent', () => {
  let component: MailDetailLayoutComponent;
  let fixture: ComponentFixture<MailDetailLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MailDetailLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MailDetailLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
