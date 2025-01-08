import { describe, it } from 'mocha';
import request from 'supertest';
import { expect } from 'chai';
import { faker } from "@faker-js/faker";
import { StatusCodes } from 'http-status-codes';
import app from '../../../src/config/express';
import * as Message from '../../../src/shared/enums/message'

const baseURL = '/api/v1/auth';

describe('AUTHENTICATION', () => {
    const email = faker.internet.email();
    const email_two = faker.internet.email();
    const phone = "09123456789";
    const phone_two = "08123456789";

    describe('USER ONE', () => {
        describe('USER VERIFY EMAIL', () => {
            it('should verify user by sending otp', (done: any) => {
                request(app)
                .post(`${baseURL}/verify-email`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({email})
                .end((_err, res) => {
                    expect(res.status).to.equal(StatusCodes.OK);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.RESOURCE_MESSAGE('Account verification initiated successfully'));
                    expect(res.body.status).to.equal('success');
                    done();
                });
            })
            it('should return error if email is not provided', (done: any) => {
                request(app)
                .post(`${baseURL}/verify-email`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({})
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal('Email is required');
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
        })
        
        describe('USER VERIFY OTP', () => {
            it('should verify user otp successfully', (done: any) => {
                request(app)
                .post(`${baseURL}/verify-signup-otp`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email, 
                    otp: process.env.OTP_OR_HASH
                })
                .end((_err, res) => {
                    expect(res.body.code).to.equal(StatusCodes.OK);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.OPERATION_SUCCESSFUL('Verify Otp'));
                    expect(res.body.status).to.equal('success');
                    done();
                });
            })
            it('should return error if user otp is incorrect', (done: any) => {
                request(app)
                .post(`${baseURL}/verify-signup-otp`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({email, otp: "123123"})
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.RESOURCE_MESSAGE('Invalid or expired OTP'));
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error if otp is not provided', (done: any) => {
                request(app)
                .post(`${baseURL}/verify-signup-otp`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({email})
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal('Otp is required');
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
        })
    
        describe('CREATE ACCOUNT', () => {
            it('should create user account successfully', (done: any) => {
                request(app)
                .post(`${baseURL}/signup`)
                .set('Accept', 'application/json')
                .set('hash-id-key', `${process.env.OTP_OR_HASH}`)
                .expect('Content-type', /json/)
                .send({
                    phone,
                    first_name: 'Tems',
                    last_name: 'Jane',
                    source: 'FACEBOOK',
                    password: 'Tems@12345',
                    username: 'tema'
                })
                .end((_err, res) => {
                    process.env.DEV_FOUNDRY_USER1_ACCESS_TOKEN = res.body.data.access_token
                    expect(res.body.code).to.equal(StatusCodes.CREATED);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('data');
                    expect(res.body.message).to.equal(Message.CREATED_DATA_SUCCESSFULLY('Stashwise account'));
                    expect(res.body.status).to.equal('success');
                    done();
                });
            })
            it('should return error if hash key is incorrect', (done: any) => {
                request(app)
                .post(`${baseURL}/signup`)
                .set('Accept', 'application/json')
                .set('hash-id-key', `${process.env.OTP_OR_HASH}ert`)
                .expect('Content-type', /json/)
                .send({
                    phone,
                    first_name: 'Tems',
                    last_name: 'Jane',
                    source: 'FACEBOOK',
                    password: 'Tems@12345',
                    username: 'tema'
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.RESOURCE_MESSAGE('Invalid or expired hash'));
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error if required fields are not provided', (done: any) => {
                request(app)
                .post(`${baseURL}/signup`)
                .set('Accept', 'application/json')
                .set('hash-id-key', `${process.env.OTP_OR_HASH}ert`)
                .expect('Content-type', /json/)
                .send({
                    phone,
                    first_name: 'Tems',
                    last_name: 'Jane',
                    password: 'Tems@12345',
                    username: 'tema'
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal('Source is required');
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
        })
       
        describe('LOGIN USER WITH EMAIL', () => {
            it('should login user successfully', (done: any) => {
                request(app)
                .post(`${baseURL}/login`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email,
                    password: 'Tems@12345',
                })
                .end((_err, res) => {
                    process.env.DEV_FOUNDRY_USER1_ID = res.body.data.user._id
                    process.env.DEV_FOUNDRY_USER1_ACCESS_TOKEN =  res.body.data.access_token
                    process.env.DEV_FOUNDRY_USER1_REFRESH_TOKEN = res.body.data.refresh_token
                    expect(res.body.code).to.equal(StatusCodes.OK);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('data');
                    expect(res.body.message).to.equal(Message.OPERATION_SUCCESSFUL('Login'));
                    expect(res.body.status).to.equal('success');
                    done();
                });
            })
            it('should return error if email is not provided', (done: any) => {
                request(app)
                .post(`${baseURL}/login`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    password: 'Tems@12345',
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal('Email is required');
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error with 2 attempts left if login credentials is not valid', (done: any) => {
                request(app)
                .post(`${baseURL}/login`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email,
                    password: 'Tems@1234590',
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.BAD_REQUEST);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.RESOURCE_MESSAGE(`Invalid login credentials. You have 2 attempts left`));
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error with 1 attempt left if login credentials is not valid', (done: any) => {
                request(app)
                .post(`${baseURL}/login`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email,
                    password: 'Tems@123459ww',
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.BAD_REQUEST);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.RESOURCE_MESSAGE(`Invalid login credentials. You have 1 attempts left`));
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error with 0 attempt left if login credentials is not valid', (done: any) => {
                request(app)
                .post(`${baseURL}/login`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email,
                    password: 'Tems@123459ww',
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.BAD_REQUEST);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.RESOURCE_MESSAGE(`Invalid login credentials. You have 0 attempts left`));
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error with time left if login credentials is not valid', (done: any) => {
                request(app)
                .post(`${baseURL}/login`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email,
                    password: '123459@Ww'
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.FORBIDDEN);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.include('You have 0 attempts left.');
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error if user does not exist', (done: any) => {
                request(app)
                .post(`${baseURL}/login`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email: faker.internet.email(),
                    password: 'Tems@1234590'
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.NOT_FOUND);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.RESOURCE_NOT_FOUND('User'));
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
        })
    })
    
    describe('USER TWO', () => {
        describe('USER VERIFY EMAIL', () => {
            it('should verify user by sending otp', (done: any) => {
                request(app)
                .post(`${baseURL}/verify-email`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email: email_two
                })
                .end((_err, res) => {
                    expect(res.status).to.equal(StatusCodes.OK);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.RESOURCE_MESSAGE('Account verification initiated successfully'));
                    expect(res.body.status).to.equal('success');
                    done();
                });
            })
            it('should return error if email already exists', (done: any) => {
                request(app)
                .post(`${baseURL}/verify-email`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({email})
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.BAD_REQUEST);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.RESOURCE_ALREADY_EXISTS('user'));
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error if email is not provided', (done: any) => {
                request(app)
                .post(`${baseURL}/verify-email`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({})
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal('Email is required');
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
        })
        
        describe('USER VERIFY OTP', () => {
            it('should verify user otp successfully', (done: any) => {
                request(app)
                .post(`${baseURL}/verify-signup-otp`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email: email_two, 
                    otp: process.env.OTP_OR_HASH
                })
                .end((_err, res) => {
                    expect(res.body.code).to.equal(StatusCodes.OK);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.OPERATION_SUCCESSFUL('Verify Otp'));
                    expect(res.body.status).to.equal('success');
                    done();
                });
            })
            it('should return error if user otp is incorrect', (done: any) => {
                request(app)
                .post(`${baseURL}/verify-signup-otp`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email: email_two, 
                    otp: "123123"
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.RESOURCE_MESSAGE('Invalid or expired OTP'));
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error if otp is not provided', (done: any) => {
                request(app)
                .post(`${baseURL}/verify-signup-otp`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email: email_two
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal('Otp is required');
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
        })
    
        describe('CREATE ACCOUNT', () => {
            it('should create user account successfully', (done: any) => {
                request(app)
                .post(`${baseURL}/signup`)
                .set('Accept', 'application/json')
                .set('hash-id-key', `${process.env.OTP_OR_HASH}`)
                .expect('Content-type', /json/)
                .send({
                    phone: phone_two,
                    first_name: 'Temmy',
                    last_name: 'Joe',
                    source: 'FACEBOOK',
                    password: 'Tems@12345',
                    username: 'temjoe'
                })
                .end((_err, res) => {
                    process.env.DEV_FOUNDRY_USER2_ACCESS_TOKEN = res.body.data.access_token
                    expect(res.body.code).to.equal(StatusCodes.CREATED);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('data');
                    expect(res.body.message).to.equal(Message.CREATED_DATA_SUCCESSFULLY('Stashwise account'));
                    expect(res.body.status).to.equal('success');
                    done();
                });
            })
            it('should return error if hash key is incorrect', (done: any) => {
                request(app)
                .post(`${baseURL}/signup`)
                .set('Accept', 'application/json')
                .set('hash-id-key', `${process.env.OTP_OR_HASH}ert`)
                .expect('Content-type', /json/)
                .send({
                    phone: phone_two,
                    first_name: 'Temmy',
                    last_name: 'Joe',
                    source: 'FACEBOOK',
                    password: 'Tems@12345',
                    username: 'temjoe'
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.RESOURCE_MESSAGE('Invalid or expired hash'));
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error if required fields are not provided', (done: any) => {
                request(app)
                .post(`${baseURL}/signup`)
                .set('Accept', 'application/json')
                .set('hash-id-key', `${process.env.OTP_OR_HASH}ert`)
                .expect('Content-type', /json/)
                .send({
                    phone: phone_two,
                    first_name: 'Temmy',
                    last_name: 'Joe',
                    password: 'Tems@12345',
                    username: 'temjoe'
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal('Source is required');
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
        })
       
        describe('LOGIN USER WITH EMAIL', () => {
            it('should login user successfully', (done: any) => {
                request(app)
                .post(`${baseURL}/login`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email: email_two,
                    password: 'Tems@12345',
                })
                .end((_err, res) => {
                    process.env.DEV_FOUNDRY_USER2_ID = res.body.data.user._id
                    process.env.DEV_FOUNDRY_USER2_ACCESS_TOKEN = res.body.data.access_token
                    process.env.DEV_FOUNDRY_USER2_REFRESH_TOKEN = res.body.data.refresh_token
                    expect(res.body.code).to.equal(StatusCodes.OK);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('data');
                    expect(res.body.message).to.equal(Message.OPERATION_SUCCESSFUL('Login'));
                    expect(res.body.status).to.equal('success');
                    done();
                });
            })
            it('should return error if login is made on a new device', (done: any) => {
                request(app)
                .post(`${baseURL}/login`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email: email_two,
                    password: 'Tems@12345',
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.CONFLICT);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.include('Received login attempt from a new device. Please check your mail');
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error if email is not provided', (done: any) => {
                request(app)
                .post(`${baseURL}/login`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    password: 'Tems@12345',
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal('Email is required');
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error with 2 attempts left if login credentials is not valid', (done: any) => {
                request(app)
                .post(`${baseURL}/login`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email: email_two,
                    password: 'Tems@1234590',
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.BAD_REQUEST);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.RESOURCE_MESSAGE(`Invalid login credentials. You have 2 attempts left`));
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error with 1 attempt left if login credentials is not valid', (done: any) => {
                request(app)
                .post(`${baseURL}/login`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email: email_two,
                    password: 'Tems@123459ww',
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.BAD_REQUEST);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.RESOURCE_MESSAGE(`Invalid login credentials. You have 1 attempts left`));
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error with 0 attempt left if login credentials is not valid', (done: any) => {
                request(app)
                .post(`${baseURL}/login`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email: email_two,
                    password: 'Tems@123459ww'
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.BAD_REQUEST);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.RESOURCE_MESSAGE(`Invalid login credentials. You have 0 attempts left`));
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error with time left if login credentials is not valid', (done: any) => {
                request(app)
                .post(`${baseURL}/login`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email: email_two,
                    password: '123459@Ww'
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.FORBIDDEN);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.include('You have 0 attempts left.');
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
            it('should return error if user does not exist', (done: any) => {
                request(app)
                .post(`${baseURL}/login`)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .send({
                    email: faker.internet.email(),
                    password: 'Tems@1234590'
                })
                .end((_err, res) => {
                    expect(res.body.statusCode).to.equal(StatusCodes.NOT_FOUND);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body.message).to.equal(Message.RESOURCE_NOT_FOUND('User'));
                    expect(res.body.status).to.equal('error');
                    done();
                });
            })
        })
    })
    
    describe('VERIFY USER LOGIN WITH PIN', () => {
        it('should login user successfully', (done: any) => {
            request(app)
            .post(`${baseURL}/verify-login`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.DEV_FOUNDRY_USER1_REFRESH_TOKEN}`)
            .expect('Content-type', /json/)
            .send({
                email,
                otp: process.env.OTP_OR_HASH,
            })
            .end((_err, res) => {
                process.env.DEV_FOUNDRY_USER1_ID = res.body.data.user._id
                process.env.DEV_FOUNDRY_USER1_ACCESS_TOKEN = res.body.data.access_token
                expect(res.body.code).to.equal(StatusCodes.OK);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.message).to.equal(Message.OPERATION_SUCCESSFUL('Login'));
                expect(res.body.status).to.equal('success');
                done();
            });
        })
        it('should return error if otp is not provided', (done: any) => {
            request(app)
            .post(`${baseURL}/verify-login`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.DEV_FOUNDRY_USER1_REFRESH_TOKEN}`)
            .expect('Content-type', /json/)
            .send({
                email,
            })
            .end((_err, res) => {
                expect(res.body.statusCode).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal('Otp is required');
                expect(res.body.status).to.equal('error');
                done();
            });
        })
        it('should return error if user otp is incorrect', (done: any) => {
            request(app)
            .post(`${baseURL}/verify-login`)
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .send({
                email, 
                otp: "123123"
            })
            .end((_err, res) => {
                expect(res.body.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal(Message.RESOURCE_MESSAGE('Invalid or expired OTP'));
                expect(res.body.status).to.equal('error');
                done();
            });
        })
    })

    describe('FORGOT PASSWORD', () => {
        it('should verify user by sending otp', (done: any) => {
            request(app)
            .post(`${baseURL}/forgot-password`)
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .send({
                email
            })
            .end((_err, res) => {
                expect(res.status).to.equal(StatusCodes.OK);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal(Message.PASSWORD_RESET_MAIL_SENT(email),);
                expect(res.body.status).to.equal('success');
                done();
            });
        })
        it('should return error if email is not provided', (done: any) => {
            request(app)
            .post(`${baseURL}/forgot-password`)
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .send({})
            .end((_err, res) => {
                expect(res.body.statusCode).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal('Email is required');
                expect(res.body.status).to.equal('error');
                done();
            });
        })
        it('should return error if user does not exist', (done: any) => {
            request(app)
            .post(`${baseURL}/forgot-password`)
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .send({
                email: faker.internet.email()
            })
            .end((_err, res) => {
                expect(res.body.statusCode).to.equal(StatusCodes.NOT_FOUND);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal(Message.RESOURCE_DOES_NOT_EXIST('user'));
                expect(res.body.status).to.equal('error');
                done();
            });
        })
    })
    
    describe('VERIFY PASSWORD OTP', () => {
        it('should verify user successfully by sending otp', (done: any) => {
            request(app)
            .post(`${baseURL}/verify-otp`)
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .send({
                email,
                otp: process.env.OTP_OR_HASH
            })
            .end((_err, res) => {
                expect(res.status).to.equal(StatusCodes.OK);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal(Message.OPERATION_SUCCESSFUL('Verify Otp'));
                expect(res.body.status).to.equal('success');
                done();
            });
        })
        it('should return error if otp is not provided', (done: any) => {
            request(app)
            .post(`${baseURL}/verify-otp`)
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .send({
                email
            })
            .end((_err, res) => {
                expect(res.body.statusCode).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal('Otp is required');
                expect(res.body.status).to.equal('error');
                done();
            });
        })
        it('should return error if user does not exist', (done: any) => {
            request(app)
            .post(`${baseURL}/verify-otp`)
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .send({
                email, otp: '012341'
            })
            .end((_err, res) => {
                expect(res.body.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal(Message.RESOURCE_MESSAGE('Invalid or expired OTP'));
                expect(res.body.status).to.equal('error');
                done();
            });
        })
    })

    describe('RESET PASSWORD', () => {
        it('should verify user successfully by sending otp', (done: any) => {
            request(app)
            .post(`${baseURL}/reset-password`)
            .set('Accept', 'application/json')
            .set('hash-id-key', `${process.env.OTP_OR_HASH}`)
            .expect('Content-type', /json/)
            .send({
                password: "Password@1"
            })
            .end((_err, res) => {
                expect(res.status).to.equal(StatusCodes.NO_CONTENT);
                expect(res.body).to.not.have.property('message');
                expect(res.body).to.not.have.property('status');
                done();
            });
        })
        it('should return error if hash key is incorrect', (done: any) => {
            request(app)
            .post(`${baseURL}/reset-password`)
            .set('Accept', 'application/json')
            .set('hash-id-key', `${process.env.OTP_OR_HASH}erert`)
            .expect('Content-type', /json/)
            .send({
                password: "Password@1"
            })
            .end((_err, res) => {
                expect(res.body.statusCode).to.equal(StatusCodes.UNAUTHORIZED);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal(Message.RESOURCE_MESSAGE('Invalid or expired hash'));
                expect(res.body.status).to.equal('error');
                done();
            });
        })
        it('should return error if password is not provided', (done: any) => {
            request(app)
            .post(`${baseURL}/reset-password`)
            .set('Accept', 'application/json')
            .set('hash-id-key', `${process.env.OTP_OR_HASH}erert`)
            .expect('Content-type', /json/)
            .send({})
            .end((_err, res) => {
                expect(res.body.statusCode).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal('Password is required');
                expect(res.body.status).to.equal('error');
                done();
            });
        })
    })

    describe('FETCH PROFILE', () => {
        it('should return user profile successfully', (done: any) => {
            request(app)
            .get(`${baseURL}/profile`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.DEV_FOUNDRY_USER1_ACCESS_TOKEN}`)
            .expect('Content-type', /json/)
            .end((_err, res) => {
                expect(res.body.code).to.equal(StatusCodes.OK);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal(Message.FETCHED_DATA_SUCCESSFULLY('Stashwise user profile'));
                expect(res.body.status).to.equal('success');
                done();
            });
        })
        it('should return error if token is invalid', (done: any) => {
            request(app)
            .get(`${baseURL}/profile`)
            .set('Accept', 'application/json')
            .query({})
            .set('Authorization', `Bearer weq3wrer${process.env.DEV_FOUNDRY_USER1_ACCESS_TOKEN}syejhduygnb345`)
            .expect('Content-type', /json/)
            .end((_err, res) => {
                expect(res.body.code).to.equal(StatusCodes.UNAUTHORIZED);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal(Message.EXPIRED_RESOURCE('token'));
                expect(res.body.status).to.equal('error');
                done();
            });
        })
    })
    
    describe('RESEND OTP', () => {
        it('should resend otp successfully', (done: any) => {
            request(app)
            .post(`${baseURL}/resend-otp`)
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .send({email})
            .end((_err, res) => {
                expect(res.body.code).to.equal(StatusCodes.OK);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal(Message.PASSWORD_RESET_MAIL_SENT(email));
                expect(res.body.status).to.equal('success');
                done();
            });
        })
        it('should return error if email does not exist', (done: any) => {
            request(app)
            .post(`${baseURL}/resend-otp`)
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .send({ email: faker.internet.email()})
            .end((_err, res) => {
                expect(res.body.statusCode).to.equal(StatusCodes.NOT_FOUND);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal(Message.RESOURCE_DOES_NOT_EXIST('user'));
                expect(res.body.status).to.equal('error');
                done();
            });
        })
    })
})