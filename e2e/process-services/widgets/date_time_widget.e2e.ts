/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from '../../actions/APS/apps.actions';
import { UsersActions } from '../../actions/users.actions';
import { browser } from 'protractor';
import { LoginPage } from '../../pages/adf/loginPage';
import { TasksPage } from '../../pages/adf/process_services/tasksPage';
import { Widget } from '../../pages/adf/process_services/widgets/widget';
import CONSTANTS = require('../../util/constants');
import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

describe('Date and time widget', () => {

    let loginPage = new LoginPage();
    let processUserModel;
    let taskPage = new TasksPage();
    let widget = new Widget();
    let alfrescoJsApi;
    let appsActions = new AppsActions();
    let appModel;
    let app = resources.Files.WIDGET_CHECK_APP.DATETIME;
    let deployedApp, process;

    beforeAll(async (done) => {
        let users = new UsersActions();

        alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        processUserModel = await users.createTenantAndUser(alfrescoJsApi);

        await alfrescoJsApi.login(processUserModel.email, processUserModel.password);
        appModel = await appsActions.importPublishDeployApp(alfrescoJsApi, resources.Files.WIDGET_CHECK_APP.file_location);

        let appDefinitions = await alfrescoJsApi.activiti.appsApi.getAppDefinitions();
        deployedApp = appDefinitions.data.find((currentApp) => {
            return currentApp.modelId === appModel.id;
        });
        process = await appsActions.startProcess(alfrescoJsApi, appModel, app.processName);
        loginPage.loginToProcessServicesUsingUserModel(processUserModel);
        done();
    });

    beforeEach(() => {
        let urlToNavigateTo = `${TestConfig.adf.url}/activiti/apps/${deployedApp.id}/tasks/`;
        browser.get(urlToNavigateTo);
        /* cspell:disable-next-line */
        taskPage.filtersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.formFields().checkFormIsDisplayed();
    });

    afterAll(async (done) => {
        await alfrescoJsApi.activiti.processApi.deleteProcessInstance(process.id);
        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
        done();
    });

    it('C268818] Date and time widget - General properties', () => {
        expect(widget.dateTimeWidget().getDateTimeLabel(app.FIELD.date_time_input)).toContain('Date');
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();

        widget.dateTimeWidget().openDatepicker(app.FIELD.date_time_input);
        widget.dateTimeWidget().selectDay('10');
        widget.dateTimeWidget().selectHour('8');
        widget.dateTimeWidget().selectMinute('30');
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();

        expect(widget.dateTimeWidget().getPlaceholder(app.FIELD.date_time_between_input)).toBe('Choose anything...');
    });

    it('[C268819] Date and time widget - Advanced properties', () => {
        widget.dateTimeWidget().openDatepicker(app.FIELD.date_time_between_input);
        widget.dateTimeWidget().selectDay('10');
        widget.dateTimeWidget().selectHour('8');
        widget.dateTimeWidget().selectMinute('30');
        widget.dateTimeWidget().setDateTimeInput(app.FIELD.date_time_between_input, '20-03-17 07:30 PM');
        widget.dateTimeWidget().clickOutsideWidget(app.FIELD.date_time_between_input);
        expect(widget.dateTimeWidget().getErrorMessage(app.FIELD.date_time_between_input)).toContain('Can\'t be less than');

        widget.dateTimeWidget().setDateTimeInput(app.FIELD.date_time_between_input, '');
        widget.dateTimeWidget().selectDay('28');
        widget.dateTimeWidget().selectHour('22');
        widget.dateTimeWidget().selectMinute('30');
        widget.dateTimeWidget().setDateTimeInput(app.FIELD.date_time_between_input, '20-03-19 07:30 PM');
        widget.dateTimeWidget().clickOutsideWidget(app.FIELD.date_time_between_input);
        expect(widget.dateTimeWidget().getErrorMessage(app.FIELD.date_time_between_input)).toContain('Can\'t be greater than');
    });
});
