import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavAvatarButtonComponent } from './nav-avatar-button.component';

describe('NavAvatarButtonComponent', () => {
  let component: NavAvatarButtonComponent;
  let fixture: ComponentFixture<NavAvatarButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavAvatarButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavAvatarButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
