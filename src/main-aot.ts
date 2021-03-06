import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
/**
 * App Module
 * our top level module that holds all of our components.
 */
import { AppModuleNgFactory } from '../compiled/src/app/app.module.ngfactory';

enableProdMode();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
