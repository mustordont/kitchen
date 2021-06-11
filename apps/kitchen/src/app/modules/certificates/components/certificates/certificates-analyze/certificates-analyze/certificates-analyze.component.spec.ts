import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatesAnalyzeComponent } from './certificates-analyze.component';

describe('CertificatesAnalyzeComponent', () => {
  let component: CertificatesAnalyzeComponent;
  let fixture: ComponentFixture<CertificatesAnalyzeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificatesAnalyzeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificatesAnalyzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
