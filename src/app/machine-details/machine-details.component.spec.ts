import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { MachineDetailsComponent } from './machine-details.component';
import { MachineService, AlertService } from '@app/services';
import { HttpClient } from '@angular/common/http';
import { OmnisMachine } from '@app/models';

describe('MachineDetailsComponent', () => {
  let component: MachineDetailsComponent;
  let fixture: ComponentFixture<MachineDetailsComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [MachineDetailsComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [MachineService, AlertService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineDetailsComponent);
    component = fixture.componentInstance;
    component.machine = new OmnisMachine();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
