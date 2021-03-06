import React from 'react';
import { mount } from 'enzyme';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;

import { LoginFacebook } from '../src/LoginFacebook';

describe('<LoginFacebook />', () => {
  let wrapper;

  const success = {
    data: {
      createUser: {
        loginToken: '123456',
        loginTokenExpires: 0,
        userId: '123456',
      },
    },
  };

  const responseSuccess = () => Promise.resolve(success);

  global.localStorage = {
    getItem: sinon.spy(),
    setItem: sinon.spy(),
  };

  beforeEach(() => {
    wrapper = mount(<LoginFacebook mutate= {responseSuccess} />);
  });

  context('when create instance', () => {
    it('LoginFacebook should exist', () => {
      expect(wrapper).to.exist;
    });

    it('should be instance of my component', () => {
      const inst = wrapper.instance();
      expect(inst).to.be.instanceOf(LoginFacebook);
    });

    it('Should be render button element', () => {
      expect(wrapper.find('button')).to.exist;
    });
  });

  context('when interactive', () => {
    context('when isLoggedIn is true and I do click', () => {
      it('Should set isLoggedIn to false', () => {
        wrapper.find('button').simulate('click');
        expect(wrapper.state().isLoggedIn).to.be.false;
      });
    });

    context('when loggedIn', () => {
      it('Should set isLoggedIn to true', () => {
        const instance = wrapper.instance();
        const detail = {
          loginToken: '123456',
          loginTokenExpires: 0,
          userId: '123456',
        };
        instance.loggedIn({ detail });
        expect(wrapper.state().isLoggedIn).to.be.true;
      });
    });
  });
});
