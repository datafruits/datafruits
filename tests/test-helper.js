import Application from 'datafruits13/app';
import config from 'datafruits13/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import setupSinon from 'ember-sinon-qunit';

setApplication(Application.create(config.APP));

setupSinon();

start();
