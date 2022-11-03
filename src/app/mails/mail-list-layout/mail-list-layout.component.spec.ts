import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailListLayoutComponent } from './mail-list-layout.component';

describe('MailListLayoutComponent', () => {
  let component: MailListLayoutComponent;
  let fixture: ComponentFixture<MailListLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MailListLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MailListLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
