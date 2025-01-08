import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';
import sinon, { SinonSpy } from 'sinon';
import requestIp from 'request-ip';
import useragent from "express-useragent"
import logger from '../../../src/shared/logger';
import { computeUserDevice } from '../../../src/shared/middlewares/common.middleware';
import Env from '../../../src/shared/utils/envholder/env';

const user = { 
  _id: '12345',
  fcm_token: "3456",
  first_name: "name",
  last_name: "last",
  last_login: new Date("2023-01-01"),
  email: "erw@mail.com",
  bvn: "243434454",
  passwordRetryMinutes: 20,
  password: "ertrbthyytnjygyhnjynjyynkunui",
  passwordRetryCount: 3,
  username: "yemi",
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  phone: '3215678908',
  is_bvn_verified: false,
  is_completed_onboarding_kyc: false,
  is_deleted: false,
  is_verified_email: true,
  is_push_notification_allowed: true,
  is_email_allowed: true,
  is_sms_allowed: true,
  source: 'FACEBOOK',
  pin: "hashedPin",
  vault_id: 'vault_uygbgvvf45556787'
};

describe('COMMON MIDDLEWARE', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: SinonSpy;
    let envGetStub: sinon.SinonStub;
    let loggerInfoStub: sinon.SinonStub;

    describe('computeUserDevice', () => {
        let useragentParseStub: sinon.SinonStub;
        let getClientIpStub: sinon.SinonStub;

        beforeEach(() => {
            req = {
              user,
              headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
              },
            };
            res = {};
            next = sinon.spy();
        
            useragentParseStub = sinon.stub(useragent, 'parse').returns({
                os: 'Windows 10',
                platform: 'Win64',
                version: '58.0.3029.110',
                browser: 'Chrome',
                isMobile: false,
                isMobileNative: false,
                isTablet: false,
                isiPad: false,
                isiPod: false,
                isiPhone: false,
                isAndroid: false,
                isBlackberry: false,
                isOpera: false,
                isIE: false,
                isEdge: false,
                isIECompatibilityMode: false,
                isSafari: false,
                isFirefox: false,
                isWebkit: false,
                isChrome: false,
                isKonqueror: false,
                isOmniWeb: false,
                isSeaMonkey: false,
                isFlock: false,
                isAmaya: false,
                isEpiphany: false,
                isDesktop: false,
                isWindows: false,
                isWindowsPhone: false,
                isLinux: false,
                isLinux64: false,
                isMac: false,
                isChromeOS: false,
                isBada: false,
                isSamsung: false,
                isRaspberry: false,
                isBot: false,
                isCurl: false,
                isAndroidTablet: false,
                isWinJs: false,
                isKindleFire: false,
                isSilk: false,
                isCaptive: false,
                isSmartTV: false,
                silkAccelerated: false,
                geoIp: {},
                source: ''
            });
        
            getClientIpStub = sinon.stub(requestIp, 'getClientIp').returns('127.0.0.1');
            loggerInfoStub = sinon.stub(logger, 'info');
            envGetStub = sinon.stub(Env, 'get');
        });
        
        afterEach(() => {
            sinon.restore(); // Restore original methods
        });
        
        it('should skip device computation and call next() when NODE_ENV is "test"', () => {
            // Arrange
            envGetStub.returns('test');
        
            // Act
            computeUserDevice(req as Request, res as Response, next as NextFunction);
        
            // Assert
            expect(req.device).to.deep.equal({});
            expect(next.calledOnce).to.be.true;
            expect(loggerInfoStub.called).to.be.false;
        });
        
        it('should compute device information and call next() when NODE_ENV is not "test"', () => {
            // Arrange
            envGetStub.returns('development');
        
            // Act
            computeUserDevice(req as Request, res as Response, next as NextFunction);
        
            // Assert
            expect(useragentParseStub.calledOnceWithExactly(req.headers!['user-agent'])).to.be.true;
            expect(getClientIpStub.calledOnceWithExactly(req as Request)).to.be.true;
            expect(req.device).to.deep.equal({
              ip_address: '127.0.0.1',
              operating_system: 'Windows 10',
              platform: 'Win64',
              browser_version: '58.0.3029.110',
              browser: 'Chrome'
            });
            expect(loggerInfoStub.calledOnce).to.be.true;
            expect(next.calledOnce).to.be.true;
        });

        it('should handle missing user-agent header gracefully', () => {
            // Arrange
            envGetStub.returns('development');
            delete req.headers!['user-agent'];  // Simulate missing user-agent
        
            // Act
            computeUserDevice(req as Request, res as Response, next as NextFunction);
        
            // Assert
            expect(useragentParseStub.calledOnceWithExactly('')).to.be.true; // Empty string passed
            expect(next.calledOnce).to.be.true;
        });
        
        it('should log device information correctly in non-test environment', () => {
            // Arrange
            envGetStub.returns('development');
        
            // Act
            computeUserDevice(req as Request, res as Response, next as NextFunction);
        
            // Assert
            const expectedLog = '12345 made API request with Browser: Chrome, version: 58.0.3029.110, Platform: Win64, Operating System: Windows 10';
            expect(loggerInfoStub.calledOnceWithExactly(expectedLog, 'computeUserDevice.common.middleware.ts')).to.be.true;
        });
    })
});