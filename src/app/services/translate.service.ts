import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";


@Injectable()
export class TranslationService {
  currentLanguage;
  constructor(
    private translateService:TranslateService
  ){}

  instant(key):any{
    return this.translateService.instant(key);
  }

  getCurrentLang(){
    return this.currentLanguage;
  }

  setDefaultLang(language){
    this.currentLanguage = language;
    this.translateService.setDefaultLang('en');
  }

  use(language){
    this.currentLanguage = language;
    this.translateService.use(language);
  }

}
