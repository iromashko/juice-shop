/// <reference types='Cypress' />

describe('Signup Test', () => {
  let randomString = Math.random().toString(36).substring(2);
  const email = `auto_${randomString}${randomString}@gmail.com`;
  const password = 'Password1';
  const securityAnswer = '1337';

  describe('UI Test', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/');
      cy.get('.cdk-overlay-backdrop').click(-50, -50, { force: true });
      cy.get('#navbarAccount').click();
      cy.get('#navbarLoginButton').click();
    });

    it('Test valid signup', () => {
      cy.get('#newCustomerLink')
        .contains('Not yet a customer?')
        .click({ force: true });
      cy.get('#emailControl').type(email);
      cy.get('#passwordControl').type(password);
      cy.get('#repeatPasswordControl').type(password);
      cy.get(
        '.mat-form-field-type-mat-select > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix'
      ).click();
      cy.get('#mat-option-15 > .mat-option-text').click();
      cy.get('#securityAnswerControl').type(securityAnswer);
      cy.get('#registerButton').click();
      cy.get('.mat-snack-bar-container').contains(
        'Registration completed successfully. You can now log in.'
      );
    });

    it('Test valid login', () => {
      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('#loginButton').click();
      cy.get('.fa-layers-counter').contains('0');
    });
  });
  describe('UI Test', () => {
    const userCredentials = {
      email,
      password,
    };
    it('Test login via API', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/rest/user/login',
        body: userCredentials,
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
    it('Login via token', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/rest/user/login',
        body: userCredentials,
      })
        .its('body')
        .then((body) => {
          const token = body.authentication.token;
          cy.wrap(token).as('userToken');
          cy.log('@userToken');
        });
    });
  });
});
