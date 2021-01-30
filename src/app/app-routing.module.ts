import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module')
                      .then( m => m.HomePageModule)
  },
  {
    path: 'test2dbs',
    loadChildren: () => import('./test2dbs/test2dbs.module')
                      .then( m => m.Test2dbsPageModule)
  },
  {
    path: 'existingconnection',
    loadChildren: () => import('./existingconnection/existingconnection.module')
                      .then( m => m.ExistingconnectionPageModule)
  },
  {
    path: 'encryption',
    loadChildren: () => import('./testencryption/testencryption.module')
                      .then( m => m.TestencryptionPageModule)
  },
  {
    path: 'upgradeversion',
    loadChildren: () => 
        import('./testupgradeversion/testupgradeversion.module')
                      .then( m => m.TestupgradeversionPageModule)
  },
  {
    path: 'importjson',
    loadChildren: () => import('./testimportjson/testimportjson.module')
                      .then( m => m.TestimportjsonPageModule)
  },
  {
    path: 'exportjson',
    loadChildren: () => import('./testexportjson/testexportjson.module')
                      .then( m => m.TestexportjsonPageModule)
  },
  {
    path: 'exportjson59',
    loadChildren: () => import('./testexportjson59/testexportjson59.module')
                      .then( m => m.Testexportjson59PageModule)
  },
  {
    path: 'json71',
    loadChildren: () => import('./testjson71/testjson71.module')
                      .then( m => m.Testjson71PageModule)
  },
  {
    path: 'copyfromassets',
    loadChildren: () => import('./copyfromassets/copyfromassets.module')
                      .then( m => m.CopyfromassetsPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
