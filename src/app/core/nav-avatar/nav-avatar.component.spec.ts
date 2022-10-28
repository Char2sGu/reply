import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavAvatarComponent } from './nav-avatar.component';

describe('NavAvatarComponent', () => {
  let component: NavAvatarComponent;
  let fixture: ComponentFixture<NavAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavAvatarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
