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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';

import { DownloadZipDialogComponent } from './download-zip.dialog';
import { FolderDialogComponent } from './folder.dialog';
import { NodeLockDialogComponent } from './node-lock.dialog';
import { ShareDialogComponent } from './share.dialog';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FormModule } from '@alfresco/adf-core';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        TranslateModule,
        FormsModule,
        FormModule,
        ReactiveFormsModule,
        MatMomentDatetimeModule,
        MatDatetimepickerModule
    ],
    declarations: [
        DownloadZipDialogComponent,
        FolderDialogComponent,
        NodeLockDialogComponent,
        ShareDialogComponent
    ],
    exports: [
        DownloadZipDialogComponent,
        FolderDialogComponent,
        NodeLockDialogComponent,
        ShareDialogComponent
    ],
    entryComponents: [
        DownloadZipDialogComponent,
        FolderDialogComponent,
        NodeLockDialogComponent,
        ShareDialogComponent
    ]
})
export class DialogModule {}
