import { TestBed } from '@angular/core/testing';

import { AiClassifier } from './ai-classifier';

describe('AiClassifier', () => {
  let service: AiClassifier;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiClassifier);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
