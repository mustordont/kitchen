import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastCertificateJobComponent } from './last-certificate-job.component';

describe('LastCertificateJobComponent', () => {
  let component: LastCertificateJobComponent;
  let fixture: ComponentFixture<LastCertificateJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastCertificateJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastCertificateJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
