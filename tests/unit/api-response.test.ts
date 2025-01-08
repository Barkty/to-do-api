import { expect } from 'chai';
import sinon from 'sinon';
import { Response } from 'express';
import { error, success } from '../../src/shared/response';
import hashingService from '../../src/shared/services/hashing/hashing.service';

describe('API-RESPONSE HANDLERS', () => {
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;
  let encryptStub: sinon.SinonStub;

  beforeEach(() => {
    // Create a mock response object
    jsonStub = sinon.stub().returnsThis();
    statusStub = sinon.stub().returns({ json: jsonStub });
    res = {
      status: statusStub,
    };

    // Stub the encryptData function in the hashingService
    encryptStub = sinon.stub(hashingService, 'encryptData').callsFake((data) => `encrypted-${data}`);
  });

  afterEach(() => {
    sinon.restore(); // Restore original methods after each test
  });

  describe('error', () => {
    it('should send an error response with the correct structure', () => {
      const err: any = { message: 'Something went wrong' };
      const code = 500;

      error(res as Response, err, code);

      expect(statusStub.calledWith(code)).to.be.false;
      expect(jsonStub.calledWith({
        status: 'error',
        code: code,
        data: undefined,
        message: err.message
      })).to.be.false;
    });
  });

  describe('success', () => {
    it('should send a success response with encrypted data', () => {
      // Arrange
      const code = 200;
      const message = 'Request successful';
      const data = { id: 1, name: 'test' };

      // Act
      success(res as Response, code, message, data);

      // Assert
      expect(statusStub.calledOnceWith(code)).to.be.true;
      expect(encryptStub.calledOnceWith(JSON.stringify(data))).to.be.true;
      expect(jsonStub.calledOnceWith({
        status: 'success',
        code,
        message,
        data: 'encrypted-{"id":1,"name":"test"}'
      })).to.be.true;
    });

    it('should send a success response with undefined data if no data is provided', () => {
      // Arrange
      const code = 200;
      const message = 'Request successful';

      // Act
      success(res as Response, code, message);

      // Assert
      expect(statusStub.calledOnceWith(code)).to.be.true;
      expect(jsonStub.calledOnceWith({
        status: 'success',
        code,
        message,
        data: undefined
      })).to.be.true;
    });
  });
});
