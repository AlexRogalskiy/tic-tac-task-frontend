import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatToolbarModule
} from '@angular/material';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatBadgeModule} from '@angular/material/badge';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatIconRegistry} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {CookieService} from 'ngx-cookie-service';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {ColorBlockModule} from 'ngx-color/block';
import {JDENTICON_CONFIG, NgxJdenticonModule} from 'ngx-jdenticon';
import {SimpleNotificationsModule} from 'angular2-notifications';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SidenavMenuComponent} from './component/fragment/sidenav-menu/sidenav-menu.component';
import {BaseTasksComponent} from './component/fragment/base-tasks/base-tasks.component';
import {TaskGroupTasksComponent} from './component/task-group-tasks/task-group-tasks.component';
import {TagTasksComponent} from './component/tag-tasks/tag-tasks.component';
import {TaskListTasksComponent} from './component/task-list-tasks/task-list-tasks.component';
import {TaskDetailsComponent} from './component/task-details/task-details.component';
import {TaskCommentsComponent} from './component/fragment/task-comments/task-comments.component';
import {ConfirmationDialogComponent} from './component/fragment/confirmation-dialog/confirmation-dialog.component';
import {ColorPickerDialogComponent} from './component/fragment/color-picker-dialog/color-picker-dialog.component';
import {NotBlankValidatorDirective} from './validator/not-blank.directive';
import {PasswordsMatchValidatorDirective} from './validator/passwords-match.directive';
import {BaseSignComponent} from './component/fragment/base-sign/base-sign.component';
import {SigninComponent} from './component/signin/signin.component';
import {SignupComponent} from './component/signup/signup.component';
import {PasswordResetComponent} from './component/password-reset/password-reset.component';
import {PasswordResetConfirmationComponent} from './component/password-reset-confirmation/password-reset-confirmation.component';
import {ErrorNotFoundComponent} from './component/error-not-found/error-not-found.component';
import {DummyComponent} from './component/dummy/dummy.component';
import {AlertComponent} from './component/fragment/alert/alert.component';
import {TagsComponent} from './component/fragment/tags/tags.component';
import {TaskListsComponent} from './component/fragment/task-lists/task-lists.component';
import {ProgressSpinnerDialogComponent} from './component/fragment/progress-spinner-dialog/progress-spinner-dialog.component';
import {ConfigService} from './service/config.service';
import {AcceptLanguageInterceptor} from './interceptor/accept-language.interceptor';
import {LocalizedDatePipe} from './pipe/localized-date.pipe';
import {LocalizedRelativeDatePipe} from './pipe/localized-relative-date.pipe';

export function TranslateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function loadConfig(configService: ConfigService) {
  return (): Promise<void> => {
    return configService.loadConfig();
  };
}

export function initIcons(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
  return () => {
    iconRegistry.addSvgIcon('logo-google',
      domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/btn_google_light_normal.svg'));
    iconRegistry.addSvgIcon('logo-facebook', domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/FB_Logo.svg'));
    iconRegistry.addSvgIcon('logo-github', domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/GitHub_Logo.svg'));
    iconRegistry.addSvgIcon('logo-vk', domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/VK_Blue_Logo.svg'));
  };
}

registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [
    AppComponent,
    SidenavMenuComponent,
    BaseTasksComponent,
    TaskGroupTasksComponent,
    TagTasksComponent,
    TaskListTasksComponent,
    TaskDetailsComponent,
    TaskCommentsComponent,
    ConfirmationDialogComponent,
    ColorPickerDialogComponent,
    NotBlankValidatorDirective,
    PasswordsMatchValidatorDirective,
    BaseSignComponent,
    SigninComponent,
    SignupComponent,
    PasswordResetComponent,
    PasswordResetConfirmationComponent,
    ErrorNotFoundComponent,
    DummyComponent,
    AlertComponent,
    TagsComponent,
    TaskListsComponent,
    ProgressSpinnerDialogComponent,
    LocalizedDatePipe,
    LocalizedRelativeDatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSidenavModule,
    MatTooltipModule,
    MatBadgeModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
    NgxMaterialTimepickerModule,
    ColorBlockModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateHttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxJdenticonModule,
    SimpleNotificationsModule.forRoot()
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: loadConfig, multi: true, deps: [ConfigService]},
    {provide: APP_INITIALIZER, useFactory: initIcons, multi: true, deps: [MatIconRegistry, DomSanitizer]},
    {provide: HTTP_INTERCEPTORS, useClass: AcceptLanguageInterceptor, multi: true},
    {provide: JDENTICON_CONFIG, useValue: {backColor: '#fff'}},
    CookieService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialogComponent, ColorPickerDialogComponent, ProgressSpinnerDialogComponent]
})
export class AppModule {
}
