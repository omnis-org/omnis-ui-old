import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisCartoComponent } from './vis-carto.component';

describe('VisCartoComponent', () => {
  let component: VisCartoComponent;
  let fixture: ComponentFixture<VisCartoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisCartoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisCartoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
