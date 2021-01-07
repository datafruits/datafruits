import Application from 'datafruits13/app';
import config from 'datafruits13/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import setupSinon from 'ember-sinon-qunit';

setApplication(Application.create(config.APP));

setupSinon();
setup(QUnit.assert);

start();
