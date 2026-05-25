import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiDashboard } from './ai-dashboard';

describe('AiDashboard', () => {
  let component: AiDashboard;
  let fixture: ComponentFixture<AiDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
