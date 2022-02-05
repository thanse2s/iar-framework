import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

// Own
import { SalesmanListComponent } from './pages/salesman-list-page/salesman-list-page.component';
import { MessagesComponent } from './components/message/messages.component';
import { EvaluationrecordPageComponent } from './pages/evaluationrecord-page/evaluationrecord-page.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommitPageComponent } from './pages/commit-page/commit-page.component';
import { EvaluationRecordComponent } from './components/evaluation-record/evaluation-record.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ManagerEvaluationRecordComponent } from './components/manager-eval-record/manager-eval-record.component';
import { HrEvaluationRecordComponent } from './components/hr-eval-record/hr-eval-record.component';
import { SingleEvalRecordComponent } from './components/single-eval-record/single-eval-record.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    LoginComponent,
    LandingPageComponent,
    MenuBarComponent,
    NotFoundPageComponent,
    SalesmanListComponent,
    CommitPageComponent,
    MessagesComponent,
    EvaluationrecordPageComponent,
    EvaluationRecordComponent,
    ManagerEvaluationRecordComponent,
    HrEvaluationRecordComponent,
    SingleEvalRecordComponent
  ],
    imports: [
        ReactiveFormsModule,
        BrowserModule,
        AppRouting,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatExpansionModule,
        MatTooltipModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
