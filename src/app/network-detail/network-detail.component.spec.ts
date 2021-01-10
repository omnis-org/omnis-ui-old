import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { OmnisNetwork } from '@app/models';
import { AlertService, NetworkService } from '@app/services';

import { NetworkDetailComponent } from './network-detail.component';

describe('NetworkDetailComponent', () => {
  let component: NetworkDetailComponent;
  let fixture: ComponentFixture<NetworkDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkDetailComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [NetworkService, AlertService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkDetailComponent);
    component = fixture.componentInstance;
    component.network = new OmnisNetwork();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
